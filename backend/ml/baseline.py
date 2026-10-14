def calculate_baseline(records):

    if not records:
        return None

    # --------------------------------------
    # SORT RECORDS BY DATE
    # --------------------------------------

    sorted_records = sorted(
        records,
        key=lambda r: r.date
    )

    # --------------------------------------
    # CALCULATE AVERAGE
    # --------------------------------------

    def average(values):

        valid_values = [
            value
            for value in values
            if value is not None
        ]

        if not valid_values:
            return None

        return sum(valid_values) / len(valid_values)

    # --------------------------------------
    # PERSONAL BASELINE
    # --------------------------------------

    baseline = {

        # =========================
        # SLEEP
        # =========================

        "average_sleep":
            average(
                r.sleep_hours
                for r in sorted_records
            ),

        "average_sleep_quality":
            average(
                r.sleep_quality
                for r in sorted_records
            ),

        # =========================
        # ACTIVITY
        # =========================

        "average_steps":
            average(
                r.steps
                for r in sorted_records
            ),

        "average_exercise_minutes":
            average(
                r.exercise_minutes
                for r in sorted_records
            ),

        "average_sitting_hours":
            average(
                r.sitting_hours
                for r in sorted_records
            ),

        # =========================
        # BODY & HEART
        # =========================

        "average_heart_rate":
            average(
                r.heart_rate
                for r in sorted_records
            ),

        "average_weight":
            average(
                r.weight
                for r in sorted_records
            ),

        # =========================
        # HYDRATION & NUTRITION
        # =========================

        "average_water":
            average(
                r.water_intake
                for r in sorted_records
            ),

        "average_meals_quality":
            average(
                r.meals_quality
                for r in sorted_records
            ),

        "average_caffeine":
            average(
                r.caffeine_intake
                for r in sorted_records
            ),

        # =========================
        # MENTAL WELLBEING
        # =========================

        "average_stress":
            average(
                r.stress_score
                for r in sorted_records
            ),

        "average_mood":
            average(
                r.mood_score
                for r in sorted_records
            ),

        "average_energy":
            average(
                r.energy_level
                for r in sorted_records
            ),

        # =========================
        # DIGITAL LIFESTYLE
        # =========================

        "average_screen_time":
            average(
                r.screen_time
                for r in sorted_records
            ),

        "average_screen_before_bed":
            average(
                r.screen_before_bed
                for r in sorted_records
            ),
    }

    return baseline