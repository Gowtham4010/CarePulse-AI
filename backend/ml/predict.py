
from pathlib import Path

import joblib
import pandas as pd


ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "lifestyle_model.joblib"


def predict_lifestyle(health_data):
    """
    Predict a demonstration lifestyle label.

    This model uses synthetic training data and is
    not intended for medical diagnosis or real-world
    clinical risk assessment.
    """

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "Trained model not found. Run train_model.py first."
        )

    artifact = joblib.load(MODEL_PATH)
    model = artifact["model"]
    features = artifact["features"]

    # Validate that all required input fields exist.
    missing_features = [
        feature for feature in features
        if feature not in health_data
    ]

    if missing_features:
        raise ValueError(
            f"Missing required features: {missing_features}"
        )

    # Build input in the exact training feature order.
    input_df = pd.DataFrame(
        [[health_data[feature] for feature in features]],
        columns=features,
    )

    prediction = int(model.predict(input_df)[0])

    probabilities = model.predict_proba(input_df)[0]
    confidence = float(max(probabilities))

    return {
        "predicted_label": prediction,
        "label_description": (
            "Positive demonstration class"
            if prediction == 1
            else "Negative demonstration class"
        ),
        "model_confidence": round(confidence, 3),
        "model_type": artifact["model_type"],
        "data_note": artifact["data_note"],
    }


if __name__ == "__main__":
    sample = {
        "sleep_hours": 7.5,
        "steps": 8000,
        "exercise_minutes": 30,
        "water_intake": 2.5,
        "stress_score": 3,
        "mood_score": 8,
        "screen_time": 4,
    }

    result = predict_lifestyle(sample)

    print("CarePulse AI - Sample Prediction")
    print("-" * 35)

    for key, value in result.items():
        print(f"{key}: {value}")
        