from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database.database import SessionLocal, engine, Base
from database.models import User, HealthRecord, MLPredictionHistory
from schemas import HealthRecordCreate

from ml.lifestyle_score import calculate_lifestyle_score
from ml.baseline import calculate_baseline
from ml.ai_insight import generate_ai_insight
from ml.anomaly import detect_anomalies
from ml.recommendations import generate_recommendations
from ml.health_prediction import predict_health_trend
from ml.trend_analysis import analyze_trends
from ml.health_risk import calculate_health_risk
from ml.health_risk_trend import calculate_risk_trend
from ml.ml_api import router as ml_router

# =========================================
# DATABASE
# =========================================

Base.metadata.create_all(bind=engine)


# =========================================
# FASTAPI APP
# =========================================

app = FastAPI(
    title="CarePulse AI API",
    description="AI-powered personal health monitoring platform",
    version="1.0.0"
)
app.include_router(ml_router)


# =========================================
# CORS
# =========================================


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://carepulse-ai-rho.vercel.app",
        "https://carepulse-m2huy0dr9-gowtham4010s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




# =========================================
# PASSWORD HASHING
# =========================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================
# DATABASE SESSION
# =========================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =========================================
# VERIFY USER
# =========================================

def verify_user(user_id: int, db: Session):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# =========================================
# ROOT
# =========================================

@app.get("/")
def root():

    return {
        "message": "CarePulse AI API is running"
    }


# =========================================
# REGISTER
# =========================================

@app.post("/auth/register")
def register(
    data: dict,
    db: Session = Depends(get_db)
):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Name, email and password are required"
        )

    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = pwd_context.hash(password)

    user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful",
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

# =========================================
# LOGIN
# =========================================
@app.post("/auth/login")
def login(
    data: dict,
    db: Session = Depends(get_db)
):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=400,
            detail="Email and password are required"
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not pwd_context.verify(
        password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }


# =========================================
# CREATE HEALTH RECORD
# =========@app.post("/auth/login")================================

@app.post("/health-records")
def create_health_record(
    data: HealthRecordCreate,
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    record = HealthRecord(
        user_id=user_id,
        **data.dict()
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


# =========================================
# GET HEALTH RECORDS
# =========================================

@app.get("/health-records")
def get_health_records(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(HealthRecord.date.desc())
        .all()
    )

    return records


# =========================================
# GET SINGLE HEALTH RECORD
# =========================================

@app.get("/health-records/{record_id}")
def get_health_record(
    record_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    record = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.id == record_id,
            HealthRecord.user_id == user_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Health record not found"
        )

    return record


# =========================================
# UPDATE HEALTH RECORD
# =========================================

@app.put("/health-records/{record_id}")
def update_health_record(
    record_id: int,
    data: dict,
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    record = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.id == record_id,
            HealthRecord.user_id == user_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Health record not found"
        )

    allowed_fields = {
        "date",
        "sleep_hours",
        "sleep_quality",
        "bedtime",
        "wake_time",
        "steps",
        "exercise_minutes",
        "sitting_hours",
        "heart_rate",
        "weight",
        "water_intake",
        "meals_quality",
        "caffeine_intake",
        "stress_score",
        "mood_score",
        "energy_level",
        "screen_time",
        "screen_before_bed"
    }

    for key, value in data.items():

        if key in allowed_fields:
            setattr(record, key, value)

    db.commit()
    db.refresh(record)

    return record


# =========================================
# DELETE HEALTH RECORD
# =========================================

@app.delete("/health-records/{record_id}")
def delete_health_record(
    record_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    record = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.id == record_id,
            HealthRecord.user_id == user_id
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Health record not found"
        )

    db.delete(record)
    db.commit()

    return {
        "message": "Health record deleted successfully"
    }


# =========================================
# LIFESTYLE SCORE
# =========================================

@app.get("/lifestyle-score")
def lifestyle_score(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    record = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.desc()
        )
        .first()
    )

    if not record:

        return {
            "score": 0,
            "category": "Not enough data",
            "breakdown": {}
        }

    result = calculate_lifestyle_score(record)

    return result


# =========================================
# PERSONAL BASELINE
# =========================================

@app.get("/health-baseline")
def health_baseline(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    return calculate_baseline(records)


# =========================================
# AI INSIGHTS
# =========================================

# =========================================
# AI INSIGHT
# =========================================

@app.get("/ai-insight")
def ai_insight(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    if not records:
        return {
            "insights": [],
            "patterns": [],
            "message": "Add health records to generate AI insights."
        }

    # Latest record
    latest_record = records[-1]

    # Calculate personal baseline
    baseline = calculate_baseline(records)

    # Generate AI insight
    result = generate_ai_insight(
        latest_record,
        baseline,
        records
    )

    return result


# =========================================
# HEALTH ANOMALIES
# =========================================

@app.get("/health-anomalies")
def health_anomalies(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    return detect_anomalies(records)


# =========================================
# AI RECOMMENDATIONS
# =========================================

# =========================================
# AI RECOMMENDATIONS
# =========================================

# =========================================
# AI RECOMMENDATIONS
# =========================================

@app.get("/ai-recommendations")
def ai_recommendations(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    # No health records
    if not records:
        return {
            "recommendations": []
        }

    # Calculate the user's personal baseline
    baseline = calculate_baseline(records)

    # Get the latest health record
    latest_record = records[-1]

    # Generate personalized AI recommendations
    result = generate_recommendations(
        latest_record,
        baseline
    )

    return result

# =========================================
# AI HEALTH TREND PREDICTION
# =========================================

@app.get("/health-prediction")
def health_prediction(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    if not records:

        return {
            "prediction": "Not enough data",
            "confidence": 0,
            "factors": [],
            "message": "Add more health records to generate a prediction."
        }

    result = predict_health_trend(records)

    return result
# =================================
# AI TREND ANALYSIS
# =================================

@app.get("/health-trend-analysis")
def health_trend_analysis(
    user_id: int,
    db: Session = Depends(get_db)
):
    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.date.asc())
        .all()
    )

    if not records:
        return {
            "status": "Not enough data",
            "trends": [],
            "summary": "Add health records to analyze your recent trends."
        }

    result = analyze_trends(records)

    return result
# =========================================================
# AI HEALTH RISK INDICATOR
# =========================================================

@app.get("/health-risk-trend")
def health_risk_trend(
    user_id: int,
    db: Session = Depends(get_db)
):
    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == user_id)
        .order_by(HealthRecord.date.asc())
        .all()
    )

    result = calculate_risk_trend(records)

    return result
# =========================================================
# AI HEALTH RISK SCORE
# =========================================================

@app.get("/health-risk-score")
def health_risk_score(
    user_id: int,
    db: Session = Depends(get_db)
):

    verify_user(user_id, db)

    records = (
        db.query(HealthRecord)
        .filter(
            HealthRecord.user_id == user_id
        )
        .order_by(
            HealthRecord.date.asc()
        )
        .all()
    )

    if not records:
        return {
            "risk_score": 0,
            "risk_level": "Not enough data",
            "message": "Add health records to calculate your health risk."
        }

    latest_record = records[-1]

    result = calculate_health_risk(
    records
)


    return result