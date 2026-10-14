from statistics import mean


def analyze_trends(records):

    if not records:
        return {
            "status": "Not enough data",
            "trends": [],
            "summary": "Add health records to analyze your recent trends."
        }

    if len(records) < 3:
        return {
            "status": "Not enough data",
            "trends": [],
            "summary": "At least 3 health records are needed for trend analysis."
        }

    sorted_records = sorted(
        records,
        key=lambda r: r.date
    )

    recent_records = sorted_records[-3:]

    trends = []

    def get_values(attribute):
        return [
            getattr(record, attribute)
            for record in recent_records
            if getattr(record, attribute) is not None
        ]

    def calculate_trend(attribute, name, unit="", lower_is_better=False):

        values = get_values(attribute)

        if len(values) < 2:
            return

        first = values[0]
        last = values[-1]

        difference = last - first

        if abs(difference) < 0.1:
            direction = "Stable"

        elif difference > 0:
            direction = "Increasing"

        else:
            direction = "Decreasing"

        if direction == "Stable":
            message = f"{name} has remained relatively stable."

        elif lower_is_better:
            if direction == "Increasing":
                message = (
                    f"{name} is increasing "
                    f"({first:.1f}{unit} → {last:.1f}{unit})."
                )
            else:
                message = (
                    f"{name} is decreasing "
                    f"({first:.1f}{unit} → {last:.1f}{unit})."
                )

        else:
            message = (
                f"{name} is {direction.lower()} "
                f"({first:.1f}{unit} → {last:.1f}{unit})."
            )

        trends.append({
            "metric": name,
            "direction": direction,
            "message": message,
            "first_value": round(first, 2),
            "latest_value": round(last, 2)
        })

    calculate_trend(
        "sleep_hours",
        "Sleep",
        " hrs"
    )

    calculate_trend(
        "steps",
        "Activity",
        " steps"
    )

    calculate_trend(
        "water_intake",
        "Hydration",
        " L"
    )

    calculate_trend(
        "stress_score",
        "Stress",
        "/10",
        lower_is_better=True
    )

    calculate_trend(
        "mood_score",
        "Mood",
        "/10"
    )

    increasing = [
        trend
        for trend in trends
        if trend["direction"] == "Increasing"
    ]

    decreasing = [
        trend
        for trend in trends
        if trend["direction"] == "Decreasing"
    ]

    if increasing or decreasing:

        parts = []

        for trend in trends:
            if trend["direction"] != "Stable":
                parts.append(trend["message"])

        summary = " ".join(parts)

    else:
        summary = "Your recent health patterns are relatively stable."

    return {
        "status": "Analyzed",
        "trends": trends,
        "summary": summary
    }