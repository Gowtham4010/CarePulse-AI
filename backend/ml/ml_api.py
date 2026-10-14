
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database.database import SessionLocal
from database.models import MLPredictionHistory, User

from .predict import predict_lifestyle


router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"],
)


class LifestyleInput(BaseModel):
    user_id: int = Field(gt=0)
    sleep_hours: float = Field(ge=0, le=24)
    steps: int = Field(ge=0, le=100000)
    exercise_minutes: int = Field(ge=0, le=1440)
    water_intake: float = Field(ge=0, le=20)
    stress_score: int = Field(ge=1, le=10)
    mood_score: int = Field(ge=1, le=10)
    screen_time: float = Field(ge=0, le=24)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/predict")
def ml_prediction(
    data: LifestyleInput,
    db: Session = Depends(get_db),
):
    try:
        user = db.query(User).filter(
            User.id == data.user_id
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found.",
            )

        input_data = data.model_dump(exclude={"user_id"})
        result = predict_lifestyle(input_data)

        history = MLPredictionHistory(
            user_id=data.user_id,
            predicted_label=result["predicted_label"],
            label_description=result["label_description"],
            model_confidence=result["model_confidence"],
            model_type=result["model_type"],
            data_note=result.get("data_note"),
            created_at=datetime.now(),
        )

        db.add(history)
        db.commit()
        db.refresh(history)

        return {
            **result,
            "history_id": history.id,
            "created_at": history.created_at.isoformat(),
            "message": "Prediction completed and saved.",
        }

    except HTTPException:
        raise

    except FileNotFoundError as exc:
        db.rollback()
        raise HTTPException(
            status_code=503,
            detail="ML model is not available. Train the model first.",
        ) from exc

    except (ValueError, TypeError) as exc:
        db.rollback()
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Could not save the prediction. Check the backend terminal.",
        ) from exc

@router.get("/prediction-history")
def get_ml_prediction_history(
    user_id: int,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    if user_id <= 0:
        raise HTTPException(
            status_code=422,
            detail="user_id must be greater than zero.",
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=422,
            detail="limit must be between 1 and 100.",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    records = (
        db.query(MLPredictionHistory)
        .filter(MLPredictionHistory.user_id == user_id)
        .order_by(
            MLPredictionHistory.created_at.desc(),
            MLPredictionHistory.id.desc(),
        )
        .limit(limit)
        .all()
    )

    return {
        "user_id": user_id,
        "count": len(records),
        "history": [
            {
                "history_id": record.id,
                "predicted_label": record.predicted_label,
                "label_description": record.label_description,
                "model_confidence": record.model_confidence,
                "model_type": record.model_type,
                "data_note": record.data_note,
                "created_at": record.created_at.isoformat(),
            }
            for record in records
        ],
    }