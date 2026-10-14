from statistics import mean

from .baseline import calculate_baseline


def predict_health_trend(records):
    """
    Predict a personal health/lifestyle trend
    by comparing the latest 3 records with the
    user's personal historical baseline.

    This is a lifestyle trend indicator,
    not a medical diagnosis.
    """

    if not records:
        return {
            "prediction": "Not enough data",
            "confidence": 0,
            "factors": [],
            "message": "Add more health records to generate a prediction."
        }

    if len(records) < 3:
        return {
            "prediction": "Not enough data",
            "confidence": 0,
            "factors": [],
            "message": "At least 3 health records are needed for trend prediction."
        }

    # =========================================================
    # SORT RECORDS BY DATE
    # =========================================================

    sorted_records = sorted(
        records,
        key=lambda record: record.date
    )

    # =========================================================
    # LATEST 3 RECORDS
    # =========================================================

    recent_records = sorted_records[-3:]

    # =========================================================
    # PERSONAL BASELINE
    # =========================================================

    baseline = calculate_baseline(sorted_records)

    if not baseline:
        return {
            "prediction": "Not enough data",
            "confidence": 0,
            "factors": [],
            "message": "Unable to calculate your personal baseline."
        }

    # =========================================================
    # HELPER
    # =========================================================

    def get_values(attribute):
        return [
            getattr(record, attribute)
            for record in recent_records
            if getattr(record, attribute, None) is not None
        ]

    # =========================================================
    # RECENT VALUES
    # =========================================================

    recent_sleep = get_values("sleep_hours")
    recent_steps = get_values("steps")
    recent_stress = get_values("stress_score")
    recent_water = get_values("water_intake")

    # =========================================================
    # SIGNAL COUNTERS
    # =========================================================

    positive_signals = 0
    negative_signals = 0

    factors = []

    # =========================================================
    # 1. SLEEP
    # =========================================================

    if recent_sleep and baseline.get("average_sleep") is not None:

        baseline_avg = baseline["average_sleep"]
        recent_avg = mean(recent_sleep)

        difference = recent_avg - baseline_avg

        if difference >= 0.5:

            positive_signals += 1

            factors.append(
                f"Sleep improved compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f} hours)"
            )

        elif difference <= -0.5:

            negative_signals += 1

            factors.append(
                f"Sleep decreased compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f} hours)"
            )

    # =========================================================
    # 2. ACTIVITY
    # =========================================================

    if recent_steps and baseline.get("average_steps") is not None:

        baseline_avg = baseline["average_steps"]
        recent_avg = mean(recent_steps)

        if baseline_avg > 0:

            percentage_change = (
                (recent_avg - baseline_avg)
                / baseline_avg
            ) * 100

            if percentage_change >= 20:

                positive_signals += 1

                factors.append(
                    f"Activity increased compared with your personal baseline "
                    f"({baseline_avg:.0f} → {recent_avg:.0f} steps)"
                )

            elif percentage_change <= -20:

                negative_signals += 1

                factors.append(
                    f"Activity decreased compared with your personal baseline "
                    f"({baseline_avg:.0f} → {recent_avg:.0f} steps)"
                )

    # =========================================================
    # 3. STRESS
    # =========================================================

    if recent_stress and baseline.get("average_stress") is not None:

        baseline_avg = baseline["average_stress"]
        recent_avg = mean(recent_stress)

        difference = recent_avg - baseline_avg

        # Lower stress is treated as a positive lifestyle signal.

        if difference <= -1:

            positive_signals += 1

            factors.append(
                f"Stress decreased compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f})"
            )

        elif difference >= 1:

            negative_signals += 1

            factors.append(
                f"Stress increased compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f})"
            )

    # =========================================================
    # 4. HYDRATION
    # =========================================================

    if recent_water and baseline.get("average_water") is not None:

        baseline_avg = baseline["average_water"]
        recent_avg = mean(recent_water)

        difference = recent_avg - baseline_avg

        if difference >= 0.3:

            positive_signals += 1

            factors.append(
                f"Hydration improved compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f} L)"
            )

        elif difference <= -0.3:

            negative_signals += 1

            factors.append(
                f"Hydration decreased compared with your personal baseline "
                f"({baseline_avg:.1f} → {recent_avg:.1f} L)"
            )

    # =========================================================
    # FINAL PREDICTION
    # =========================================================

    total_signals = positive_signals + negative_signals

    if total_signals == 0:

        prediction = "Stable"

        confidence = 50

        message = (
            "Your recent lifestyle patterns are broadly "
            "consistent with your personal baseline."
        )

    elif positive_signals > negative_signals:

        prediction = "Positive Trend"

        confidence = min(
            95,
            60 + positive_signals * 10
        )

        message = (
            "Your recent lifestyle patterns show "
            "more positive changes than negative changes "
            "compared with your personal baseline."
        )

    elif negative_signals > positive_signals:

        prediction = "Needs Attention"

        confidence = min(
            95,
            60 + negative_signals * 10
        )

        message = (
            "Some recent lifestyle patterns differ "
            "negatively from your personal baseline."
        )

    else:

        prediction = "Mixed Trend"

        confidence = 60

        message = (
            "Your recent lifestyle patterns contain "
            "both positive and negative changes "
            "compared with your personal baseline."
        )

    # =========================================================
    # RETURN RESULT
    # =========================================================

    return {
        "prediction": prediction,
        "confidence": confidence,
        "factors": factors,
        "message": message
    }