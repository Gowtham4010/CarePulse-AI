import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RatingGuide = ({ description, levels }) => (
  <div className="rating-guide">
    <p className="rating-guide-description">{description}</p>

    <details>
      <summary>ⓘ How do I choose my rating?</summary>

      <div className="rating-guide-levels">
        {levels.map((level) => (
          <div key={level.range} className="rating-guide-item">
            <strong>{level.range}</strong>
            <span>{level.label}</span>
          </div>
        ))}
      </div>
    </details>
  </div>
);

function HealthData() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    sleep_hours: "",
    sleep_quality: "",
    bedtime: "",
    wake_time: "",
    steps: "",
    exercise_minutes: "",
    sitting_hours: "",
    heart_rate: "",
    weight: "",
    water_intake: "",
    meals_quality: "",
    caffeine_intake: "",
    stress_score: "",
    mood_score: "",
    energy_level: "",
    screen_time: "",
    screen_before_bed: "",
  });

  const [loading, setLoading] = useState(false);

  // Automatically calculate sleep duration when times change.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => {
      const updatedForm = {
        ...previous,
        [name]: value,
      };

      if (name === "bedtime" || name === "wake_time") {
        const bedtime =
          name === "bedtime" ? value : previous.bedtime;

        const wakeTime =
          name === "wake_time" ? value : previous.wake_time;

        if (!bedtime || !wakeTime || bedtime === wakeTime) {
          updatedForm.sleep_hours = "";
        } else {
          const [bedHours, bedMinutes] = bedtime
            .split(":")
            .map(Number);

          const [wakeHours, wakeMinutes] = wakeTime
            .split(":")
            .map(Number);

          const bedTotal = bedHours * 60 + bedMinutes;
          let wakeTotal = wakeHours * 60 + wakeMinutes;

          // Support sleep that continues past midnight.
          if (wakeTotal < bedTotal) {
            wakeTotal += 24 * 60;
          }

          const durationHours = (wakeTotal - bedTotal) / 60;

          updatedForm.sleep_hours =
            durationHours > 0 && durationHours <= 24
              ? durationHours.toFixed(2)
              : "";
        }
      }

      return updatedForm;
    });
  };

  // Calculate estimated sleep quality score automatically.
  const sleepQualityScore = (() => {
    if (
      form.sleep_hours === "" ||
      form.sleep_quality === ""
    ) {
      return null;
    }

    const hours = Number(form.sleep_hours);
    const quality = Number(form.sleep_quality);

    if (
      !Number.isFinite(hours) ||
      !Number.isFinite(quality) ||
      hours <= 0 ||
      hours > 24 ||
      quality < 1 ||
      quality > 10
    ) {
      return null;
    }

    // Duration contributes up to 30 points.
    let durationPoints;

    if (hours >= 7 && hours <= 9) {
      durationPoints = 30;
    } else if (hours < 7) {
      durationPoints = (hours / 7) * 30;
    } else {
      durationPoints = Math.max(
        0,
        30 - (hours - 9) * 10
      );
    }

    // Self-reported sleep quality contributes up to 70 points.
    const ratingPoints = (quality / 10) * 70;

    return Math.round(
      Math.min(100, durationPoints + ratingPoints)
    );
  })();

  const sleepQualityLabel =
    sleepQualityScore === null
      ? "Enter bedtime, wake-up time and sleep quality"
      : sleepQualityScore >= 80
        ? "Good"
        : sleepQualityScore >= 60
          ? "Moderate"
          : sleepQualityScore >= 40
            ? "Poor"
            : "Very poor";

  // Save health data to the existing backend endpoint.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (
      !form.bedtime ||
      !form.wake_time ||
      !form.sleep_hours
    ) {
      alert("Please enter valid bedtime and wake-up times.");
      return;
    }

    if (
      !form.sleep_quality ||
      Number(form.sleep_quality) < 1 ||
      Number(form.sleep_quality) > 10
    ) {
      alert("Please enter sleep quality from 1 to 10.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        date: form.date,
        sleep_hours: Number(form.sleep_hours),
        sleep_quality: Number(form.sleep_quality),
        bedtime: form.bedtime,
        wake_time: form.wake_time,
        steps: Number(form.steps),
        exercise_minutes: Number(form.exercise_minutes),
        sitting_hours: Number(form.sitting_hours),
        heart_rate: Number(form.heart_rate),
        weight: Number(form.weight),
        water_intake: Number(form.water_intake),
        meals_quality: Number(form.meals_quality),
        caffeine_intake: Number(form.caffeine_intake),
        stress_score: Number(form.stress_score),
        mood_score: Number(form.mood_score),
        energy_level: Number(form.energy_level),
        screen_time: Number(form.screen_time),
        screen_before_bed: Number(form.screen_before_bed),
      };

      const response = await api.post(
        "/health-records",
        payload,
        {
          params: {
            user_id: userId,
          },
        }
      );

      console.log("Health data saved:", response.data);

      alert("Today's lifestyle data has been saved!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving health data:", error);

      if (error.response) {
        alert(
          `Failed to save data.\n\n${
            error.response.data?.detail ||
            "Please check your health data."
          }`
        );
      } else {
        alert("Cannot connect to CarePulse AI backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="health-data-page">
      
     
<div className="medical-hologram" aria-hidden="true">
  <div className="holo-grid" />
  <div className="holo-aura" />

  <div className="holo-ring holo-ring-one" />
  <div className="holo-ring holo-ring-two" />
  <div className="holo-ring holo-ring-three" />

  <div className="holo-heart">
    <svg viewBox="0 0 200 190" className="holo-heart-svg">
      <defs>
        <linearGradient id="heartGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="heartGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M100 160 C82 142 28 105 28 65 C28 24 77 14 100 49 C123 14 172 24 172 65 C172 105 118 142 100 160 Z"
        fill="rgba(34,211,238,0.12)"
        stroke="url(#heartGradient)"
        strokeWidth="3"
        filter="url(#heartGlow)"
      />

      <path
        d="M32 88 H65 L81 61 L101 111 L119 78 L132 88 H168"
        fill="none"
        stroke="#d5ffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#heartGlow)"
      />
    </svg>
  </div>

  <div className="holo-scan-line" />

  <div className="holo-data holo-data-one">
    <span className="holo-dot" />
    AI HEALTH SYSTEM
    <strong>ACTIVE</strong>
  </div>

  <div className="holo-data holo-data-two">
    <span>✚</span>
    WELLNESS MONITOR
  </div>

  <span className="holo-particle hp-one" />
  <span className="holo-particle hp-two" />
  <span className="holo-particle hp-three" />
  <span className="holo-particle hp-four" />
  <span className="holo-particle hp-five" />
  <span className="holo-particle hp-six" />

  <div className="holo-platform">
    <div />
  </div>
</div>
 
      
      <div className="health-data-container">
        <div className="health-data-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Daily Lifestyle Check-in</h1>

          <p>
            Tell CarePulse AI how your day went.
            Your information helps identify personal
            health and lifestyle patterns.
          </p>
        </div>

        <form
          className="health-data-form"
          onSubmit={handleSubmit}
        >
          {/* SLEEP AND RECOVERY */}
          <section className="form-section">
            <div className="section-heading">
              <span>😴</span>
              <div>
                <h2>Sleep & Recovery</h2>
                <p>
                  Tell us about your previous night's sleep.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="sleep-date">Date</label>
                <input
                  id="sleep-date"
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sleep-hours">
                  Sleep duration (hours)
                </label>
                <input
                  id="sleep-hours"
                  type="number"
                  name="sleep_hours"
                  min="0"
                  max="24"
                  step="0.01"
                  value={form.sleep_hours}
                  readOnly
                  placeholder="Calculated automatically"
                  required
                />
                <small>
                  Automatically calculated from bedtime and
                  wake-up time.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="sleep-quality">
                  Sleep quality (1–10)
                </label>
                <input
                  id="sleep-quality"
                  type="number"
                  name="sleep_quality"
                  min="1"
                  max="10"
                  step="1"
                  value={form.sleep_quality}
                  onChange={handleChange}
                  placeholder="Example: 8"
                  required
                />
                <small>
                  Rate how well you feel you slept.
                  1 = very poor, 10 = excellent.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="bedtime">Bedtime</label>
                <input
                  id="bedtime"
                  type="time"
                  name="bedtime"
                  value={form.bedtime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="wake-time">Wake-up time</label>
                <input
                  id="wake-time"
                  type="time"
                  name="wake_time"
                  value={form.wake_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div
              className="sleep-quality-result"
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #dbe3ee",
                borderRadius: "14px",
                background: "#f8fafc",
              }}
            >
              <h3 style={{ margin: "0 0 8px" }}>
                Automatic Sleep Quality Score
              </h3>

              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                }}
              >
                {sleepQualityScore === null
                  ? "-- / 100"
                  : `${sleepQualityScore} / 100`}
              </div>

              <p style={{ margin: "6px 0" }}>
                {sleepQualityLabel}
              </p>

              <small>
                Estimated from sleep duration and your sleep
                quality rating. This is an illustrative score,
                not a medical assessment.
              </small>
            </div>
          </section>

          {/* ACTIVITY AND MOVEMENT */}
          <section className="form-section">
            <div className="section-heading">
              <span>🏃</span>
              <div>
                <h2>Activity & Movement</h2>
                <p>Understand how active your day was.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="steps">Steps</label>
                <input
                  id="steps"
                  type="number"
                  name="steps"
                  min="0"
                  value={form.steps}
                  onChange={handleChange}
                  placeholder="Example: 6500"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exercise-minutes">
                  Exercise (minutes)
                </label>
                <input
                  id="exercise-minutes"
                  type="number"
                  name="exercise_minutes"
                  min="0"
                  max="1440"
                  value={form.exercise_minutes}
                  onChange={handleChange}
                  placeholder="Example: 45"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sitting-hours">
                  Sitting time (hours)
                </label>
                <input
                  id="sitting-hours"
                  type="number"
                  name="sitting_hours"
                  min="0"
                  max="24"
                  step="0.5"
                  value={form.sitting_hours}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  required
                />
              </div>
            </div>
          </section>

          {/* BODY AND HEART */}
          <section className="form-section">
            <div className="section-heading">
              <span>❤️</span>
              <div>
                <h2>Body & Heart</h2>
                <p>Record your basic physical measurements.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="heart-rate">
                  Resting heart rate (bpm)
                </label>
                <input
                  id="heart-rate"
                  type="number"
                  name="heart_rate"
                  min="30"
                  max="220"
                  value={form.heart_rate}
                  onChange={handleChange}
                  placeholder="Example: 72"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  min="1"
                  max="300"
                  step="0.1"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="Example: 68.5"
                  required
                />
              </div>
            </div>
          </section>

          {/* HYDRATION AND NUTRITION */}
          <section className="form-section">
            <div className="section-heading">
              <span>💧</span>
              <div>
                <h2>Hydration & Nutrition</h2>
                <p>Track basic daily habits.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="water-intake">
                  Water intake (litres)
                </label>
                <input
                  id="water-intake"
                  type="number"
                  name="water_intake"
                  min="0"
                  max="15"
                  step="0.1"
                  value={form.water_intake}
                  onChange={handleChange}
                  placeholder="Example: 2.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="meals-quality">
                  Meals quality (1–10)
                </label>
                <input
                  id="meals-quality"
                  type="number"
                  name="meals_quality"
                  min="1"
                  max="10"
                  value={form.meals_quality}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="caffeine-intake">
                  Caffeine servings
                </label>
                <input
                  id="caffeine-intake"
                  type="number"
                  name="caffeine_intake"
                  min="0"
                  max="20"
                  value={form.caffeine_intake}
                  onChange={handleChange}
                  placeholder="Example: 2"
                  required
                />
              </div>
            </div>
          </section>

          {/* MENTAL WELLBEING */}
          <section className="form-section">
            <div className="section-heading">
              <span>🧠</span>
              <div>
                <h2>Mental Wellbeing</h2>
                <p>How did you feel today?</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="stress-score">
                  Stress level (1–10)
                </label>
                <input
                  id="stress-score"
                  type="number"
                  name="stress_score"
                  min="1"
                  max="10"
                  step="1"
                  value={form.stress_score}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  required
                />

                <RatingGuide
                  description="How much pressure, tension, or worry did you feel today?"
                  levels={[
                    { range: "1–2", label: "Very relaxed" },
                    { range: "3–4", label: "Slightly stressed" },
                    { range: "5–6", label: "Moderately stressed" },
                    { range: "7–8", label: "Very stressed" },
                    { range: "9–10", label: "Extremely stressed" },
                  ]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="mood-score">Mood (1–10)</label>
                <input
                  id="mood-score"
                  type="number"
                  name="mood_score"
                  min="1"
                  max="10"
                  step="1"
                  value={form.mood_score}
                  onChange={handleChange}
                  placeholder="Example: 8"
                  required
                />

                <RatingGuide
                  description="How did you feel emotionally today?"
                  levels={[
                    { range: "1–2", label: "Very unhappy or sad" },
                    { range: "3–4", label: "Feeling low or upset" },
                    { range: "5–6", label: "Normal or okay" },
                    { range: "7–8", label: "Happy or positive" },
                    { range: "9–10", label: "Very happy or cheerful" },
                  ]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="energy-level">
                  Energy level (1–10)
                </label>
                <input
                  id="energy-level"
                  type="number"
                  name="energy_level"
                  min="1"
                  max="10"
                  step="1"
                  value={form.energy_level}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  required
                />

                <RatingGuide
                  description="How energetic or tired did you feel today?"
                  levels={[
                    { range: "1–2", label: "Extremely tired" },
                    { range: "3–4", label: "Low energy" },
                    { range: "5–6", label: "Average energy" },
                    { range: "7–8", label: "Energetic" },
                    { range: "9–10", label: "Extremely energetic" },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* DIGITAL LIFESTYLE */}
          <section className="form-section">
            <div className="section-heading">
              <span>📱</span>
              <div>
                <h2>Digital Lifestyle</h2>
                <p>
                  Understand how screen usage affects your routine.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="screen-time">
                  Total screen time (hours)
                </label>
                <input
                  id="screen-time"
                  type="number"
                  name="screen_time"
                  min="0"
                  max="24"
                  step="0.1"
                  value={form.screen_time}
                  onChange={handleChange}
                  placeholder="Example: 6.5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="screen-before-bed">
                  Screen time before bed (hours)
                </label>
                <input
                  id="screen-before-bed"
                  type="number"
                  name="screen_before_bed"
                  min="0"
                  max="12"
                  step="0.1"
                  value={form.screen_before_bed}
                  onChange={handleChange}
                  placeholder="Example: 1.5"
                  required
                />
              </div>
            </div>
          </section>

          {/* SUBMIT */}
          <div className="form-submit">
            <p>
              Your data is used to analyze personal lifestyle
              patterns. CarePulse AI does not provide medical
              diagnosis.
            </p>

            <button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : "Save Today's Lifestyle Data"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HealthData;