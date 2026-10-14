
import pandas as pd


def create_training_data():
    """
    Create sample lifestyle data for developing
    the CarePulse AI machine learning pipeline.

    This is synthetic demonstration data, not real
    patient data or clinically validated data.
    """

    data = {
        "sleep_hours": [
            8.0, 7.5, 7.0, 6.0, 5.0,
            8.5, 4.5, 7.2, 6.5, 5.5,
            8.0, 7.0, 6.0, 4.0, 7.8,
            6.8, 5.2, 8.2, 6.3, 7.4
        ],
        "steps": [
            9000, 8000, 7000, 4000, 2500,
            10000, 1800, 7500, 5000, 3000,
            8500, 6500, 3500, 1200, 9500,
            6000, 2200, 11000, 4500, 7800
        ],
        "exercise_minutes": [
            40, 35, 30, 10, 5,
            50, 0, 30, 15, 5,
            45, 25, 10, 0, 40,
            20, 5, 55, 15, 35
        ],
        "water_intake": [
            2.8, 2.5, 2.4, 1.8, 1.2,
            3.0, 1.0, 2.6, 2.0, 1.5,
            2.7, 2.3, 1.7, 1.0, 2.8,
            2.2, 1.3, 3.2, 1.9, 2.5
        ],
        "stress_score": [
            2, 3, 4, 7, 9,
            2, 9, 3, 6, 8,
            2, 4, 7, 10, 3,
            5, 9, 2, 6, 3
        ],
        "mood_score": [
            9, 8, 8, 5, 3,
            9, 2, 8, 6, 4,
            9, 7, 5, 2, 9,
            7, 3, 10, 6, 8
        ],
        "screen_time": [
            3, 4, 5, 7, 10,
            3, 11, 4, 6, 9,
            3, 5, 8, 12, 4,
            6, 10, 2, 7, 4
        ],
        "lifestyle_label": [
            1, 1, 1, 0, 0,
            1, 0, 1, 0, 0,
            1, 1, 0, 0, 1,
            1, 0, 1, 0, 1
        ]
    }

    return pd.DataFrame(data)


if __name__ == "__main__":
    df = create_training_data()

    print("CarePulse AI - Sample Training Data")
    print("-" * 40)
    print(df.head())
    print()
    print("Dataset shape:", df.shape)
    print()
    print("Missing values:")
    print(df.isnull().sum())