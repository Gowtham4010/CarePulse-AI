def generate_recommendations(latest_record, baseline):
    recommendations = []

    if not latest_record:
        return recommendations

    # -----------------------------
    # Sleep recommendation
    # -----------------------------
    if (
        latest_record.sleep_hours is not None
        and baseline.get("average_sleep") is not None
    ):
        if latest_record.sleep_hours < baseline["average_sleep"] - 1:
            recommendations.append({
                "category": "Sleep",
                "priority": "High",
                "message": (
                    f"Your sleep today is {latest_record.sleep_hours} hours, "
                    f"which is below your personal baseline of "
                    f"{baseline['average_sleep']:.1f} hours."
                ),
                "action": (
                    "Try maintaining a consistent sleep schedule and "
                    "reduce screen exposure before bedtime."
                )
            })

    # -----------------------------
    # Hydration recommendation
    # -----------------------------
    if (
        latest_record.water_intake is not None
        and baseline.get("average_water") is not None
    ):
        if latest_record.water_intake < baseline["average_water"] * 0.7:
            recommendations.append({
                "category": "Hydration",
                "priority": "Medium",
                "message": (
                    f"Your water intake today is {latest_record.water_intake} L, "
                    f"compared with your usual "
                    f"{baseline['average_water']:.1f} L."
                ),
                "action": (
                    "Try increasing your water intake gradually throughout "
                    "the day."
                )
            })

    # -----------------------------
    # Activity recommendation
    # -----------------------------
    if (
        latest_record.steps is not None
        and baseline.get("average_steps") is not None
    ):
        if latest_record.steps < baseline["average_steps"] * 0.8:
            recommendations.append({
                "category": "Activity",
                "priority": "Medium",
                "message": (
                    f"Your activity today is {latest_record.steps:,} steps, "
                    f"below your usual average of "
                    f"{baseline['average_steps']:,.0f} steps."
                ),
                "action": (
                    "Consider adding a short walk or light physical activity "
                    "if appropriate for you."
                )
            })

    # -----------------------------
    # Exercise recommendation
    # -----------------------------
    if latest_record.exercise_minutes is not None:
        if latest_record.exercise_minutes < 15:
            recommendations.append({
                "category": "Exercise",
                "priority": "Medium",
                "message": (
                    f"You recorded {latest_record.exercise_minutes} minutes "
                    "of exercise today."
                ),
                "action": (
                    "If appropriate for you, consider adding a short session "
                    "of walking, stretching, or light exercise."
                )
            })

    # -----------------------------
    # Stress recommendation
    # -----------------------------
    if latest_record.stress_score is not None:
        if latest_record.stress_score >= 8:
            recommendations.append({
                "category": "Stress",
                "priority": "High",
                "message": (
                    f"Your stress score is {latest_record.stress_score}/10, "
                    "which is considerably high."
                ),
                "action": (
                    "Consider taking short breaks, practicing relaxation "
                    "techniques, and prioritizing adequate rest."
                )
            })

    # -----------------------------
    # Screen time recommendation
    # -----------------------------
    if latest_record.screen_time is not None:
        if latest_record.screen_time > 8:
            recommendations.append({
                "category": "Screen Time",
                "priority": "Medium",
                "message": (
                    f"Your screen time today is "
                    f"{latest_record.screen_time:.1f} hours."
                ),
                "action": (
                    "Consider taking regular screen breaks and reducing "
                    "unnecessary screen use when possible."
                )
            })

    # -----------------------------
    # Screen before bed recommendation
    # -----------------------------
    if latest_record.screen_before_bed is not None:
        if latest_record.screen_before_bed > 2:
            recommendations.append({
                "category": "Digital Wellness",
                "priority": "Medium",
                "message": (
                    f"You used screens for approximately "
                    f"{latest_record.screen_before_bed:.1f} hours before bed."
                ),
                "action": (
                    "Consider reducing screen exposure before bedtime "
                    "and following a consistent wind-down routine."
                )
            })

    # -----------------------------
    # Combined sleep + stress
    # -----------------------------
    if (
        latest_record.sleep_hours is not None
        and latest_record.stress_score is not None
    ):
        if (
            latest_record.sleep_hours < 6
            and latest_record.stress_score >= 8
        ):
            recommendations.append({
                "category": "Recovery",
                "priority": "High",
                "message": (
                    "Low sleep and high stress were detected together."
                ),
                "action": (
                    "Focus on recovery by prioritizing rest, hydration, "
                    "and stress-management activities."
                )
            })

    # -----------------------------
    # No recommendation
    # -----------------------------
    if not recommendations:
        recommendations.append({
            "category": "Overall",
            "priority": "Low",
            "message": (
                "Your latest health measurements are generally close "
                "to your personal baseline."
            ),
            "action": (
                "Continue monitoring your daily health patterns "
                "and maintaining consistent healthy habits."
            )
        })

    return recommendations