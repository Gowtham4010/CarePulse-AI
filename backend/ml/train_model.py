
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

from training_data import create_training_data


# Locate the ML directory.
ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "lifestyle_model.joblib"


def train_model():
    # Load the demonstration dataset.
    df = create_training_data()

    target_column = "lifestyle_label"
    X = df.drop(columns=[target_column])
    y = df[target_column]

    # Keep a separate test set for evaluation.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    # Build a preprocessing and classification pipeline.
    model = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=100,
                    random_state=42,
                    class_weight="balanced",
                ),
            ),
        ]
    )

    # Train and evaluate the model.
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    print("CarePulse AI - Lifestyle Model")
    print("-" * 35)
    print("Training samples:", len(X_train))
    print("Test samples:", len(X_test))
    print("Test accuracy:", round(accuracy_score(y_test, predictions), 3))
    print()
    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0,
        )
    )

    # Save the trained model and its feature names.
    artifact = {
        "model": model,
        "features": list(X.columns),
        "target": target_column,
        "model_type": "RandomForestClassifier",
        "data_note": (
            "Trained on synthetic demonstration data; "
            "not clinically validated."
        ),
    }

    joblib.dump(artifact, MODEL_PATH)
    print("Model saved to:", MODEL_PATH)


if __name__ == "__main__":
    train_model()