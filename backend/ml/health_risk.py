from statistics import mean


def calculate_health_risk(records):
    """
    Calculate a personalized lifestyle-pattern risk indicator.

    This is NOT a medical diagnosis.
    It compares the latest health data with reasonable
    lifestyle targets and the user's own historical patterns.
    """

    if not records:
        return {
            "risk_score": 0,
            "risk_level": "Insufficient Data",
            "factors": [],
            "summary": "Not enough health data to calculate a personalized risk indicator.",
            "disclaimer": (
                "This is a lifestyle-pattern indicator and is not a medical diagnosis."
            )
        }

    # ---------------------------------------------------------
    # SORT RECORDS BY DATE
    # ---------------------------------------------------------

    sorted_records = sorted(
        records,
        key=lambda record: record.date
    )

    # ---------------------------------------------------------
    # USE LATEST RECORD
    # ---------------------------------------------------------

    latest = sorted_records[-1]

    # ---------------------------------------------------------
    # PERSONAL BASELINES
    # ---------------------------------------------------------

    def values(attribute):
        return [
            getattr(record, attribute)
            for record in sorted_records
            if getattr(record, attribute, None) is not None
        ]

    sleep_values = values("sleep_hours")
    steps_values = values("steps")
    water_values = values("water_intake")
    stress_values = values("stress_score")
    mood_values = values("mood_score")
    heart_rate_values = values("heart_rate")

    baseline_sleep = mean(sleep_values) if sleep_values else None
    baseline_steps = mean(steps_values) if steps_values else None
    baseline_water = mean(water_values) if water_values else None
    baseline_stress = mean(stress_values) if stress_values else None
    baseline_mood = mean(mood_values) if mood_values else None
    baseline_heart_rate = (
        mean(heart_rate_values)
        if heart_rate_values
        else None
    )

    # ---------------------------------------------------------
    # HELPER
    # ---------------------------------------------------------

    def clamp(value, minimum=0, maximum=100):
        return max(minimum, min(maximum, value))

    factors = []

    # =========================================================
    # 1. SLEEP — 20%
    # =========================================================

    if latest.sleep_hours is not None:

        sleep = latest.sleep_hours

        if sleep < 5:
            sleep_risk = 90
            message = (
                "Sleep duration is significantly below a healthy lifestyle target."
            )
            status = "attention"

        elif sleep < 6:
            sleep_risk = 65
            message = (
                "Sleep duration is below the recommended lifestyle range."
            )
            status = "attention"

        elif sleep < 7:
            sleep_risk = 35
            message = (
                "Sleep duration is slightly below the target range."
            )
            status = "moderate"

        elif sleep <= 9:
            sleep_risk = 5
            message = (
                "Sleep duration is within a healthy lifestyle range."
            )
            status = "good"

        else:
            sleep_risk = 20
            message = (
                "Sleep duration is above the usual target range."
            )
            status = "moderate"

        factors.append({
            "factor": "Sleep",
            "weight": 20,
            "risk": sleep_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 2. ACTIVITY — 20%
    # =========================================================

    if latest.steps is not None:

        steps = latest.steps

        if baseline_steps and baseline_steps > 0:

            activity_ratio = steps / baseline_steps

            if activity_ratio < 0.50:
                activity_risk = 90
                message = (
                    "Recent activity is significantly below your personal baseline."
                )
                status = "attention"

            elif activity_ratio < 0.75:
                activity_risk = 65
                message = (
                    "Recent activity is below your personal baseline."
                )
                status = "attention"

            elif activity_ratio < 0.90:
                activity_risk = 35
                message = (
                    "Recent activity is slightly below your personal baseline."
                )
                status = "moderate"

            else:
                activity_risk = 5
                message = (
                    "Activity is close to your personal baseline."
                )
                status = "good"

        else:

            if steps < 3000:
                activity_risk = 85
                message = (
                    "Daily activity is relatively low."
                )
                status = "attention"

            elif steps < 5000:
                activity_risk = 55
                message = (
                    "Daily activity could be increased."
                )
                status = "moderate"

            else:
                activity_risk = 5
                message = (
                    "Activity level is reasonable."
                )
                status = "good"

        factors.append({
            "factor": "Activity",
            "weight": 20,
            "risk": activity_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 3. HYDRATION — 15%
    # =========================================================

    if latest.water_intake is not None:

        water = latest.water_intake

        if water < 1.2:
            hydration_risk = 90
            message = "Water intake is considerably low."
            status = "attention"

        elif water < 1.8:
            hydration_risk = 60
            message = (
                "Water intake is below the target lifestyle range."
            )
            status = "moderate"

        elif water < 2.0:
            hydration_risk = 30
            message = (
                "Water intake is slightly below the target."
            )
            status = "moderate"

        else:
            hydration_risk = 5
            message = "Hydration level is reasonable."
            status = "good"

        factors.append({
            "factor": "Hydration",
            "weight": 15,
            "risk": hydration_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 4. STRESS — 15%
    # =========================================================

    if latest.stress_score is not None:

        stress = latest.stress_score

        if stress >= 9:
            stress_risk = 95
            message = "Stress score is very high."
            status = "attention"

        elif stress >= 7:
            stress_risk = 70
            message = "Stress score is elevated."
            status = "attention"

        elif stress >= 5:
            stress_risk = 40
            message = "Stress score is moderate."
            status = "moderate"

        else:
            stress_risk = 5
            message = "Stress score is relatively low."
            status = "good"

        factors.append({
            "factor": "Stress",
            "weight": 15,
            "risk": stress_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 5. MOOD — 10%
    # =========================================================

    if latest.mood_score is not None:

        mood = latest.mood_score

        if mood <= 3:
            mood_risk = 90
            message = "Mood score is considerably low."
            status = "attention"

        elif mood <= 5:
            mood_risk = 60
            message = "Mood score is below the preferred range."
            status = "moderate"

        elif mood <= 7:
            mood_risk = 30
            message = "Mood score is moderate."
            status = "moderate"

        else:
            mood_risk = 5
            message = "Mood score is relatively positive."
            status = "good"

        factors.append({
            "factor": "Mood",
            "weight": 10,
            "risk": mood_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 6. HEART RATE — 10%
    # =========================================================

    if latest.heart_rate is not None:

        heart_rate = latest.heart_rate

        # Broad lifestyle-pattern comparison.
        # This is NOT a clinical heart-rate assessment.

        if baseline_heart_rate:

            difference = abs(
                heart_rate - baseline_heart_rate
            )

            if difference > 20:
                heart_rate_risk = 80
                message = (
                    "Heart rate is substantially different "
                    "from your personal baseline."
                )
                status = "attention"

            elif difference > 10:
                heart_rate_risk = 45
                message = (
                    "Heart rate differs moderately "
                    "from your personal baseline."
                )
                status = "moderate"

            else:
                heart_rate_risk = 5
                message = (
                    "Heart rate is close to your personal baseline."
                )
                status = "good"

        else:

            if 60 <= heart_rate <= 100:
                heart_rate_risk = 5
                message = (
                    "Heart rate is within the broad "
                    "lifestyle reference range."
                )
                status = "good"

            else:
                heart_rate_risk = 50
                message = (
                    "Heart rate is outside the broad "
                    "lifestyle reference range."
                )
                status = "moderate"

        factors.append({
            "factor": "Heart Rate",
            "weight": 10,
            "risk": heart_rate_risk,
            "status": status,
            "message": message
        })

    # =========================================================
    # 7. RECENT ACTIVITY TREND — 10%
    # =========================================================
    #
    # FIX:
    # Compare the latest record with the previous record
    # instead of comparing the latest 3 records with all
    # previous history.
    #
    # This makes the risk score represent the user's
    # CURRENT activity direction.

    trend_risk = 5
    trend_message = (
        "Recent activity trend is relatively stable."
    )
    trend_status = "good"

    if len(sorted_records) >= 2:

        previous = sorted_records[-2]

        if (
            latest.steps is not None
            and previous.steps is not None
            and previous.steps > 0
        ):

            latest_steps = latest.steps
            previous_steps = previous.steps

            change = (
                (latest_steps - previous_steps)
                / previous_steps
            ) * 100

            if change < -30:

                trend_risk = 80
                trend_message = (
                    "Recent activity shows a significant downward trend."
                )
                trend_status = "attention"

            elif change < -15:

                trend_risk = 50
                trend_message = (
                    "Recent activity shows a downward trend."
                )
                trend_status = "moderate"

            elif change > 30:

                trend_risk = 5
                trend_message = (
                    "Recent activity shows a strong improvement."
                )
                trend_status = "good"

            elif change > 15:

                trend_risk = 5
                trend_message = (
                    "Recent activity is improving."
                )
                trend_status = "good"

        factors.append({
            "factor": "Recent Trend",
            "weight": 10,
            "risk": trend_risk,
            "status": trend_status,
            "message": trend_message
        })

    # =========================================================
    # FINAL WEIGHTED SCORE
    # =========================================================

    if not factors:
        return {
            "risk_score": 0,
            "risk_level": "Insufficient Data",
            "factors": [],
            "summary": "Not enough health information is available.",
            "disclaimer": (
                "This is a lifestyle-pattern indicator "
                "and is not a medical diagnosis."
            )
        }

    total_weight = sum(
        factor["weight"]
        for factor in factors
    )

    weighted_risk = sum(
        factor["risk"] * factor["weight"]
        for factor in factors
    )

    risk_score = round(
        weighted_risk / total_weight
    )

    risk_score = clamp(risk_score)

    # =========================================================
    # RISK LEVEL
    # =========================================================

    if risk_score < 25:
        risk_level = "Low"

    elif risk_score < 50:
        risk_level = "Moderate"

    elif risk_score < 75:
        risk_level = "High"

    else:
        risk_level = "Very High"

    # =========================================================
    # SUMMARY
    # =========================================================

    attention_factors = [
        factor["factor"]
        for factor in factors
        if factor["status"] == "attention"
    ]

    if attention_factors:

        summary = (
            "The indicator is mainly influenced by: "
            + ", ".join(attention_factors)
            + "."
        )

    else:

        summary = (
            "Current lifestyle patterns are relatively stable "
            "based on the available data."
        )

    # =========================================================
    # RETURN RESULT
    # =========================================================

    return {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "factors": factors,
        "summary": summary,
        "disclaimer": (
            "This is a lifestyle-pattern indicator "
            "and is not a medical diagnosis."
        )
    }