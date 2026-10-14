from statistics import mean


def calculate_risk_trend(records):
    """
    Calculate the historical lifestyle-pattern risk trend.

    The historical risk calculation follows the same core
    lifestyle thresholds used by the main health-risk system.

    This is NOT a medical diagnosis.
    """

    if not records:
        return {
            "trend": "Insufficient Data",
            "direction": "neutral",
            "change": 0,
            "message": "Not enough health records to analyze risk trend.",
            "history": []
        }

    # =========================================================
    # SORT RECORDS CHRONOLOGICALLY
    # =========================================================

    sorted_records = sorted(
        records,
        key=lambda r: r.date
    )

    history = []

    # =========================================================
    # CALCULATE RISK FOR EACH RECORD
    # =========================================================

    for record in sorted_records:

        risk_points = []

        # -----------------------------------------------------
        # Sleep
        # Same thresholds as main health-risk calculation
        # -----------------------------------------------------

        if record.sleep_hours is not None:

            sleep = record.sleep_hours

            if sleep < 5:
                risk_points.append(90)

            elif sleep < 6:
                risk_points.append(65)

            elif sleep < 7:
                risk_points.append(35)

            elif sleep <= 9:
                risk_points.append(5)

            else:
                risk_points.append(20)

        # -----------------------------------------------------
        # Activity
        # -----------------------------------------------------

        if record.steps is not None:

            steps = record.steps

            if steps < 3000:
                risk_points.append(85)

            elif steps < 5000:
                risk_points.append(55)

            else:
                risk_points.append(5)

        # -----------------------------------------------------
        # Hydration
        # -----------------------------------------------------

        if record.water_intake is not None:

            water = record.water_intake

            if water < 1.2:
                risk_points.append(90)

            elif water < 1.8:
                risk_points.append(60)

            elif water < 2.0:
                risk_points.append(30)

            else:
                risk_points.append(5)

        # -----------------------------------------------------
        # Stress
        # -----------------------------------------------------

        if record.stress_score is not None:

            stress = record.stress_score

            if stress >= 9:
                risk_points.append(95)

            elif stress >= 7:
                risk_points.append(70)

            elif stress >= 5:
                risk_points.append(40)

            else:
                risk_points.append(5)

        # -----------------------------------------------------
        # Mood
        # -----------------------------------------------------

        if record.mood_score is not None:

            mood = record.mood_score

            if mood <= 3:
                risk_points.append(90)

            elif mood <= 5:
                risk_points.append(60)

            elif mood <= 7:
                risk_points.append(30)

            else:
                risk_points.append(5)

        # -----------------------------------------------------
        # Heart Rate
        #
        # For historical records we use the broad lifestyle
        # reference range instead of today's personal baseline.
        # This avoids using future/latest data to calculate
        # the risk of an older record.
        # -----------------------------------------------------

        if record.heart_rate is not None:

            heart_rate = record.heart_rate

            if 60 <= heart_rate <= 100:
                risk_points.append(5)

            else:
                risk_points.append(50)

        # -----------------------------------------------------
        # Calculate historical risk
        # -----------------------------------------------------

        if risk_points:

            daily_risk = round(mean(risk_points))

        else:

            daily_risk = 0

        history.append({
            "date": str(record.date),
            "risk_score": daily_risk
        })

    # =========================================================
    # INSUFFICIENT HISTORY
    # =========================================================

    if len(history) < 2:

        return {
            "trend": "Insufficient Data",
            "direction": "neutral",
            "change": 0,
            "message": "Add more health records to identify a risk trend.",
            "history": history
        }

    # =========================================================
    # FIRST VS LATEST RISK
    # =========================================================

    first_score = history[0]["risk_score"]
    latest_score = history[-1]["risk_score"]

    change = latest_score - first_score

    # =========================================================
    # TREND CLASSIFICATION
    # =========================================================

    if change <= -10:

        direction = "improving"
        trend = "Improving"

        message = (
            "Your lifestyle risk indicator has decreased "
            "over the recorded period."
        )

    elif change >= 10:

        direction = "worsening"
        trend = "Increasing"

        message = (
            "Your lifestyle risk indicator has increased "
            "over the recorded period."
        )

    else:

        direction = "stable"
        trend = "Stable"

        message = (
            "Your lifestyle risk indicator has remained "
            "relatively stable."
        )

    # =========================================================
    # FINAL RESPONSE
    # =========================================================

    return {
        "trend": trend,
        "direction": direction,
        "change": change,
        "message": message,
        "history": history
    }