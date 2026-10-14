from datetime import date
from typing import Optional

from pydantic import BaseModel


# =========================================
# CREATE HEALTH RECORD
# =========================================

class HealthRecordCreate(BaseModel):

    date: date

    # Sleep
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[int] = None

    bedtime: Optional[str] = None
    wake_time: Optional[str] = None

    # Activity
    steps: Optional[int] = None
    exercise_minutes: Optional[int] = None
    sitting_hours: Optional[float] = None

    # Basic health
    heart_rate: Optional[int] = None
    weight: Optional[float] = None

    # Lifestyle
    water_intake: Optional[float] = None
    meals_quality: Optional[int] = None
    caffeine_intake: Optional[int] = None

    # Mental wellbeing
    stress_score: Optional[int] = None
    mood_score: Optional[int] = None
    energy_level: Optional[int] = None

    # Digital lifestyle
    screen_time: Optional[float] = None
    screen_before_bed: Optional[float] = None


# =========================================
# HEALTH RECORD RESPONSE
# =========================================

class HealthRecordResponse(BaseModel):

    id: int
    user_id: int
    date: date

    # Sleep
    sleep_hours: Optional[float] = None
    sleep_quality: Optional[int] = None

    bedtime: Optional[str] = None
    wake_time: Optional[str] = None

    # Activity
    steps: Optional[int] = None
    exercise_minutes: Optional[int] = None
    sitting_hours: Optional[float] = None

    # Basic health
    heart_rate: Optional[int] = None
    weight: Optional[float] = None

    # Lifestyle
    water_intake: Optional[float] = None
    meals_quality: Optional[int] = None
    caffeine_intake: Optional[int] = None

    # Mental wellbeing
    stress_score: Optional[int] = None
    mood_score: Optional[int] = None
    energy_level: Optional[int] = None

    # Digital lifestyle
    screen_time: Optional[float] = None
    screen_before_bed: Optional[float] = None

    class Config:
        from_attributes = True