
from sqlalchemy import Column, Integer, Float, Date, String, DateTime
from .database import Base


class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)

    # Basic information
    date = Column(Date, nullable=False)

    # Sleep
    sleep_hours = Column(Float)
    sleep_quality = Column(Integer)
    bedtime = Column(String)
    wake_time = Column(String)

    # Physical activity
    steps = Column(Integer)
    exercise_minutes = Column(Integer)
    sitting_hours = Column(Float)

    # Heart / body
    heart_rate = Column(Integer)
    weight = Column(Float)

    # Hydration / nutrition
    water_intake = Column(Float)
    meals_quality = Column(Integer)
    caffeine_intake = Column(Integer)

    # Mental wellbeing
    stress_score = Column(Integer)
    mood_score = Column(Integer)
    energy_level = Column(Integer)

    # Digital lifestyle
    screen_time = Column(Float)
    screen_before_bed = Column(Float)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class MLPredictionHistory(Base):
    __tablename__ = "ml_prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    predicted_label = Column(Integer, nullable=False)
    label_description = Column(String, nullable=False)
    model_confidence = Column(Float, nullable=False)
    model_type = Column(String, nullable=False)
    data_note = Column(String, nullable=True)
    created_at = Column(DateTime, nullable=False)