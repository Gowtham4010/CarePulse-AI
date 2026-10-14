def calculate_lifestyle_score(record):
    """
    Calculate a non-diagnostic lifestyle score from 0-100.

    This score is for lifestyle pattern monitoring only.
    It is NOT a medical score.
    """

    # -------------------------
    # Sleep - 30 points
    # -------------------------

    sleep_score = 0

    if 7 <= record.sleep_hours <= 9:
        sleep_score += 20
    elif 6 <= record.sleep_hours < 7:
        sleep_score += 15
    elif 5 <= record.sleep_hours < 6:
        sleep_score += 8
    else:
        sleep_score += 3

    sleep_score += record.sleep_quality

    # -------------------------
    # Activity - 20 points
    # -------------------------

    activity_score = 0

    if record.steps >= 8000:
        activity_score += 10
    elif record.steps >= 5000:
        activity_score += 8
    elif record.steps >= 3000:
        activity_score += 5
    else:
        activity_score += 2

    if record.exercise_minutes >= 45:
        activity_score += 10
    elif record.exercise_minutes >= 30:
        activity_score += 8
    elif record.exercise_minutes >= 15:
        activity_score += 5
    else:
        activity_score += 2

    # -------------------------
    # Hydration - 10 points
    # -------------------------

    hydration_score = 0

    if record.water_intake >= 2.5:
        hydration_score = 10
    elif record.water_intake >= 2:
        hydration_score = 8
    elif record.water_intake >= 1.5:
        hydration_score = 6
    elif record.water_intake >= 1:
        hydration_score = 4
    else:
        hydration_score = 1

    # -------------------------
    # Nutrition - 10 points
    # -------------------------

    nutrition_score = record.meals_quality

    # -------------------------
    # Mental wellbeing - 15 points
    # -------------------------

    mental_score = (
        record.mood_score * 0.75
        + record.energy_level * 0.75
        + (10 - record.stress_score) * 0.75
    )
    mental_score = min(15, max(0, round(mental_score)))

    # -------------------------
    # Digital lifestyle - 15 points
    # -------------------------

    digital_score = 0

    if record.screen_time <= 5:
        digital_score += 8
    elif record.screen_time <= 7:
        digital_score += 6
    elif record.screen_time <= 10:
        digital_score += 4
    else:
        digital_score += 2

    if record.screen_before_bed <= 0.5:
        digital_score += 7
    elif record.screen_before_bed <= 1:
        digital_score += 5
    elif record.screen_before_bed <= 2:
        digital_score += 3
    else:
        digital_score += 1

    # -------------------------
    # Calculate total score
    # -------------------------

    score = (
        sleep_score
        + activity_score
        + hydration_score
        + nutrition_score
        + mental_score
        + digital_score
    )

    # -------------------------
    # Adjustments
    # -------------------------

    if record.sitting_hours > 10:
        score -= 5
    elif record.sitting_hours > 8:
        score -= 2

    if record.caffeine_intake >= 6:
        score -= 3
    elif record.caffeine_intake >= 4:
        score -= 1

    # -------------------------
    # Keep score between 0-100
    # -------------------------

    score = max(0, min(100, round(score)))

    # -------------------------
    # Score category
    # -------------------------

    if score >= 80:
        category = "Excellent"

    elif score >= 65:
        category = "Good"

    elif score >= 50:
        category = "Needs Improvement"

    else:
        category = "Needs Attention"

    # -------------------------
    # Score breakdown
    # -------------------------

    breakdown = {
        "sleep": round(sleep_score),
        "activity": round(activity_score),
        "hydration": round(hydration_score),
        "nutrition": round(nutrition_score),
        "mental_wellbeing": round(mental_score),
        "digital_lifestyle": round(digital_score)
    }

    return {
        "score": score,
        "category": category,
        "breakdown": breakdown
    }