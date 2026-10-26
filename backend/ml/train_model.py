
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_score,
    train_test_split,
)
from sklearn.pipeline import Pipeline

from ml.training_data import create_training_data

ML_DIR = Path(__file__).resolve().parent
MODEL_PATH = ML_DIR / "lifestyle_model.joblib"


def build_model():
    """Create the preprocessing and classification pipeline."""
    return Pipeline(
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


def train_model():
    # Load the synthetic demonstration dataset.
    df = create_training_data()

    target_column = "lifestyle_label"
    X = df.drop(columns=[target_column])
    y = df[target_column]

    print("CarePulse AI - Lifestyle Model Evaluation")
    print("-" * 45)
    print("Total samples:", len(df))
    print("Features:", len(X.columns))
    print("Class distribution:")
    print(y.value_counts().sort_index().to_string())
    print()

    # Evaluate using stratified cross-validation.
    class_counts = y.value_counts()
    n_splits = min(5, int(class_counts.min()))

    if n_splits < 2:
        raise ValueError(
            "At least two examples per class are needed "
            "for stratified cross-validation."
        )

    cv = StratifiedKFold(
        n_splits=n_splits,
        shuffle=True,
        random_state=42,
    )

    cv_model = build_model()

    cv_scores = cross_val_score(
        cv_model,
        X,
        y,
        cv=cv,
        scoring="accuracy",
    )

    print(f"{n_splits}-fold cross-validation accuracy:")
    print("Fold scores:", [round(score, 3) for score in cv_scores])
    print("Mean accuracy:", round(float(cv_scores.mean()), 3))
    print("Standard deviation:", round(float(cv_scores.std()), 3))
    print()
    print(
        "IMPORTANT: These results use a very small synthetic "
        "dataset and do not measure real-world or clinical accuracy."
    )
    print()

    # Keep a separate holdout test set for a second evaluation.
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    model = build_model()
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    print("Holdout evaluation")
    print("-" * 25)
    print("Training samples:", len(X_train))
    print("Test samples:", len(X_test))
    print("Holdout accuracy:", round(accuracy_score(y_test, predictions), 3))
    print()
    print(
        classification_report(
            y_test,
            predictions,
            zero_division=0,
        )
    )

    # Preserve the artifact format expected by predict.py.
    # Train the final pipeline on all available demonstration data.
    final_model = build_model()
    final_model.fit(X, y)

    artifact = {
        "model": final_model,
        "features": list(X.columns),
        "target": target_column,
        "model_type": "RandomForestClassifier",
        "data_note": (
            "Trained on synthetic demonstration data; "
            "not clinically validated. Confidence is not "
            "real-world accuracy."
        ),
    }

    joblib.dump(artifact, MODEL_PATH)
    print("Final model saved to:", MODEL_PATH)


if __name__ == "__main__":
    train_model()