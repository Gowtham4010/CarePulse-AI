def generate_ai_insight(record, baseline, records):
    """
    Generate personalized lifestyle insights.

    Uses the user's own health history to identify
    simple patterns and comparisons.

    This is NOT a medical diagnosis.
    """

    insights = []
    patterns = []

    # =========================================
    # PERSONAL BASELINE COMPARISON
    # =========================================

    # SLEEP
    if (
        record.sleep_hours is not None
        and baseline["average_sleep"] is not None
        and record.sleep_hours < baseline["average_sleep"] - 1
    ):
        insights.append(
            "Your sleep is significantly below your personal baseline."
        )

    elif (
        record.sleep_hours is not None
        and baseline["average_sleep"] is not None
        and record.sleep_hours > baseline["average_sleep"] + 1
    ):
        insights.append(
            "Your sleep is higher than your personal baseline."
        )

    # STEPS
    if (
        record.steps is not None
        and baseline["average_steps"] is not None
        and record.steps < baseline["average_steps"] * 0.7
    ):
        insights.append(
            "Your activity level is lower than your usual baseline."
        )

    elif (
        record.steps is not None
        and baseline["average_steps"] is not None
        and record.steps > baseline["average_steps"] * 1.3
    ):
        insights.append(
            "Your activity level is higher than your usual baseline."
        )

    # HEART RATE
    if (
        record.heart_rate is not None
        and baseline["average_heart_rate"] is not None
        and abs(
            record.heart_rate
            - baseline["average_heart_rate"]
        ) > 10
    ):
        insights.append(
            "Your heart rate is noticeably different from your personal baseline."
        )

    # WATER
    if (
        record.water_intake is not None
        and baseline["average_water"] is not None
        and record.water_intake
        < baseline["average_water"] * 0.7
    ):
        insights.append(
            "Your water intake is lower than your usual baseline."
        )

    # STRESS
    if (
        record.stress_score is not None
        and baseline["average_stress"] is not None
        and record.stress_score
        > baseline["average_stress"] + 2
    ):
        insights.append(
            "Your stress score is higher than your personal baseline."
        )

    # MOOD
    if (
        record.mood_score is not None
        and baseline["average_mood"] is not None
        and record.mood_score
        < baseline["average_mood"] - 2
    ):
        insights.append(
            "Your mood score is lower than your personal baseline."
        )

    # =========================================
    # PERSONALIZED PATTERN DETECTION
    # =========================================

    if len(records) >= 3:

        # =========================================
        # SCREEN TIME → SLEEP
        # =========================================

        screen_records = [
            r for r in records
            if r.screen_time is not None
            and r.sleep_hours is not None
        ]

        if len(screen_records) >= 3:

            high_screen_records = [
                r for r in screen_records
                if baseline["average_screen_time"] is not None
                and r.screen_time > baseline["average_screen_time"]
            ]

            low_screen_records = [
                r for r in screen_records
                if baseline["average_screen_time"] is not None
                and r.screen_time <= baseline["average_screen_time"]
            ]

            if high_screen_records and low_screen_records:

                high_screen_sleep = sum(
                    r.sleep_hours
                    for r in high_screen_records
                ) / len(high_screen_records)

                low_screen_sleep = sum(
                    r.sleep_hours
                    for r in low_screen_records
                ) / len(low_screen_records)

                if high_screen_sleep < low_screen_sleep - 0.5:

                    patterns.append(
                        "Your data suggests that higher screen time is associated with shorter sleep duration."
                    )

        # =========================================
        # STRESS → ACTIVITY
        # =========================================

        stress_records = [
            r for r in records
            if r.stress_score is not None
            and r.steps is not None
        ]

        if len(stress_records) >= 3:

            high_stress_records = [
                r for r in stress_records
                if baseline["average_stress"] is not None
                and r.stress_score > baseline["average_stress"]
            ]

            low_stress_records = [
                r for r in stress_records
                if baseline["average_stress"] is not None
                and r.stress_score <= baseline["average_stress"]
            ]

            if high_stress_records and low_stress_records:

                high_stress_steps = sum(
                    r.steps
                    for r in high_stress_records
                ) / len(high_stress_records)

                low_stress_steps = sum(
                    r.steps
                    for r in low_stress_records
                ) / len(low_stress_records)

                if high_stress_steps < low_stress_steps * 0.8:

                    patterns.append(
                        "Your data suggests that higher stress is associated with lower daily activity."
                    )

        # =========================================
        # SLEEP → ENERGY
        # =========================================

        sleep_energy_records = [
            r for r in records
            if r.sleep_hours is not None
            and r.energy_level is not None
        ]

        if len(sleep_energy_records) >= 3:

            low_sleep_records = [
                r for r in sleep_energy_records
                if baseline["average_sleep"] is not None
                and r.sleep_hours < baseline["average_sleep"]
            ]

            normal_sleep_records = [
                r for r in sleep_energy_records
                if baseline["average_sleep"] is not None
                and r.sleep_hours >= baseline["average_sleep"]
            ]

            if low_sleep_records and normal_sleep_records:

                low_sleep_energy = sum(
                    r.energy_level
                    for r in low_sleep_records
                ) / len(low_sleep_records)

                normal_sleep_energy = sum(
                    r.energy_level
                    for r in normal_sleep_records
                ) / len(normal_sleep_records)

                if low_sleep_energy < normal_sleep_energy - 1:

                    patterns.append(
                        "Your data suggests that shorter sleep is associated with lower energy levels."
                    )

        # =========================================
        # SLEEP → STRESS
        # =========================================

        sleep_stress_records = [
            r for r in records
            if r.sleep_hours is not None
            and r.stress_score is not None
        ]

        if len(sleep_stress_records) >= 3:

            low_sleep_stress_records = [
                r for r in sleep_stress_records
                if baseline["average_sleep"] is not None
                and r.sleep_hours < baseline["average_sleep"]
            ]

            normal_sleep_stress_records = [
                r for r in sleep_stress_records
                if baseline["average_sleep"] is not None
                and r.sleep_hours >= baseline["average_sleep"]
            ]

            if (
                low_sleep_stress_records
                and normal_sleep_stress_records
            ):

                low_sleep_stress = sum(
                    r.stress_score
                    for r in low_sleep_stress_records
                ) / len(low_sleep_stress_records)

                normal_sleep_stress = sum(
                    r.stress_score
                    for r in normal_sleep_stress_records
                ) / len(normal_sleep_stress_records)

                if low_sleep_stress > normal_sleep_stress + 1:

                    patterns.append(
                        "Your data suggests that shorter sleep is associated with higher stress levels."
                    )

        # =========================================
        # SCREEN BEFORE BED → SLEEP
        # =========================================

        bed_screen_records = [
            r for r in records
            if r.screen_before_bed is not None
            and r.sleep_hours is not None
        ]

        if len(bed_screen_records) >= 3:

            high_bed_screen_records = [
                r for r in bed_screen_records
                if baseline["average_screen_before_bed"] is not None
                and r.screen_before_bed
                > baseline["average_screen_before_bed"]
            ]

            low_bed_screen_records = [
                r for r in bed_screen_records
                if baseline["average_screen_before_bed"] is not None
                and r.screen_before_bed
                <= baseline["average_screen_before_bed"]
            ]

            if (
                high_bed_screen_records
                and low_bed_screen_records
            ):

                high_bed_sleep = sum(
                    r.sleep_hours
                    for r in high_bed_screen_records
                ) / len(high_bed_screen_records)

                low_bed_sleep = sum(
                    r.sleep_hours
                    for r in low_bed_screen_records
                ) / len(low_bed_screen_records)

                if high_bed_sleep < low_bed_sleep - 0.5:

                    patterns.append(
                        "Your data suggests that more screen use before bed is associated with shorter sleep."
                    )

    # =========================================
    # COMBINE INSIGHTS AND PATTERNS
    # =========================================

    insights.extend(patterns)

    # =========================================
    # DEFAULT MESSAGE
    # =========================================

    if not insights:

        insights.append(
            "Your recent health measurements are close to your personal baseline."
        )

    # =========================================
    # FINAL RESULT
    # =========================================

    return {
        "insights": insights,
        "patterns": patterns,
        "message": " ".join(insights)
    }