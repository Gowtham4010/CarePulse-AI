from .baseline import calculate_baseline


def detect_anomalies(records):

    if not records:
        return {
            "anomalies": [],
            "count": 0
        }

    anomalies = []

    # -------------------------------------------------
    # Sort records by date
    # -------------------------------------------------

    sorted_records = sorted(
        records,
        key=lambda r: r.date
    )

    # -------------------------------------------------
    # Use shared personal baseline
    # -------------------------------------------------

    baseline = calculate_baseline(sorted_records)

    if not baseline:
        return {
            "anomalies": [],
            "count": 0
        }

    # -------------------------------------------------
    # Latest health record
    # -------------------------------------------------

    latest = sorted_records[-1]

    # -------------------------------------------------
    # Personal baseline values
    # -------------------------------------------------

    avg_sleep = baseline["average_sleep"]
    avg_steps = baseline["average_steps"]
    avg_heart = baseline["average_heart_rate"]
    avg_water = baseline["average_water"]
    avg_stress = baseline["average_stress"]
    avg_mood = baseline["average_mood"]

    # -------------------------------------------------
    # Sleep anomaly
    # -------------------------------------------------

    if (
        latest.sleep_hours is not None
        and avg_sleep is not None
        and latest.sleep_hours < avg_sleep - 1.5
    ):
        anomalies.append({
            "type": "Sleep",
            "severity": "Medium",
            "message": (
                f"Your sleep ({latest.sleep_hours} hrs) "
                f"is significantly below your personal average "
                f"({avg_sleep:.1f} hrs)."
            )
        })

    # -------------------------------------------------
    # Activity anomaly
    # -------------------------------------------------

    if (
        latest.steps is not None
        and avg_steps is not None
        and latest.steps < avg_steps * 0.5
    ):
        anomalies.append({
            "type": "Activity",
            "severity": "Medium",
            "message": (
                f"Your activity ({latest.steps:,} steps) "
                f"is much lower than your personal average "
                f"({avg_steps:,.0f} steps)."
            )
        })

    # -------------------------------------------------
    # Heart rate anomaly
    # -------------------------------------------------

    if (
        latest.heart_rate is not None
        and avg_heart is not None
        and abs(latest.heart_rate - avg_heart) > 15
    ):
        anomalies.append({
            "type": "Heart Rate",
            "severity": "High",
            "message": (
                f"Your heart rate ({latest.heart_rate} BPM) "
                f"differs noticeably from your personal average "
                f"({avg_heart:.0f} BPM)."
            )
        })

    # -------------------------------------------------
    # Hydration anomaly
    # -------------------------------------------------

    if (
        latest.water_intake is not None
        and avg_water is not None
        and latest.water_intake < avg_water - 0.5
    ):
        anomalies.append({
            "type": "Hydration",
            "severity": "Medium",
            "message": (
                f"Your water intake ({latest.water_intake} L) "
                f"is below your personal average "
                f"({avg_water:.1f} L)."
            )
        })

    # -------------------------------------------------
    # Stress anomaly
    # -------------------------------------------------

    if (
        latest.stress_score is not None
        and avg_stress is not None
        and latest.stress_score > avg_stress + 1.5
    ):
        anomalies.append({
            "type": "Stress",
            "severity": "High",
            "message": (
                f"Your stress score ({latest.stress_score}/10) "
                f"is higher than your personal average "
                f"({avg_stress:.1f}/10)."
            )
        })

    # -------------------------------------------------
    # Mood anomaly
    # -------------------------------------------------

    if (
        latest.mood_score is not None
        and avg_mood is not None
        and latest.mood_score < avg_mood - 2
    ):
        anomalies.append({
            "type": "Mood",
            "severity": "Medium",
            "message": (
                f"Your mood score ({latest.mood_score}/10) "
                f"is lower than your personal average "
                f"({avg_mood:.1f}/10)."
            )
        })

    # -------------------------------------------------
    # Combined pattern
    # -------------------------------------------------

    if (
        latest.sleep_hours is not None
        and latest.sleep_hours < 6
        and latest.stress_score is not None
        and latest.stress_score >= 7
    ):
        anomalies.append({
            "type": "Combined Pattern",
            "severity": "High",
            "message": (
                "Low sleep and high stress were detected together. "
                "This may indicate a difficult recovery day."
            )
        })

    # -------------------------------------------------
    # Final result
    # -------------------------------------------------

    return {
        "anomalies": anomalies,
        "count": len(anomalies)
    }