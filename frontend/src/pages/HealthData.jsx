
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =========================
  // SAVE HEALTH DATA
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get logged-in user's ID
    const userId = localStorage.getItem("userId");

    // If user is not logged in
    if (!userId) {
      alert("⚠️ Please login first.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {

      // =========================
      // PREPARE HEALTH DATA
      // =========================

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


      // =========================
      // SEND DATA TO BACKEND
      // =========================

      const response = await api.post(
        "/health-records",
        payload,
        {
          params: {
            user_id: userId,
          },
        }
      );


      // =========================
      // SUCCESS
      // =========================

      console.log(
        "Health data saved:",
        response.data
      );

      alert(
        "✅ Today's lifestyle data has been saved!"
      );

      navigate("/dashboard");


    } catch (error) {

      // =========================
      // ERROR
      // =========================

      console.error(
        "Error saving health data:",
        error
      );

      if (error.response) {

        console.error(
          "Backend error:",
          error.response.data
        );

        alert(
          `❌ Failed to save data.\n\n${
            error.response.data?.detail ||
            "Please check your health data."
          }`
        );

      } else {

        alert(
          "❌ Cannot connect to CarePulse AI backend."
        );

      }

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="health-data-page">

      <div className="health-data-container">

        {/* Header */}

        <div className="health-data-header">

          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>
            Daily Lifestyle Check-in
          </h1>

          <p>
            Tell CarePulse AI how your day went.
            Your information helps identify
            personal health and lifestyle patterns.
          </p>

        </div>


        <form
          className="health-data-form"
          onSubmit={handleSubmit}
        >

          {/* ========================= */}
          {/* SLEEP */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>😴</span>

              <div>

                <h2>
                  Sleep & Recovery
                </h2>

                <p>
                  Tell us about your previous night's sleep.
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Sleep duration (hours)
                </label>

                <input
                  type="number"
                  name="sleep_hours"
                  min="0"
                  max="24"
                  step="0.1"
                  value={form.sleep_hours}
                  onChange={handleChange}
                  placeholder="Example: 7.5"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Sleep quality (1–10)
                </label>

                <input
                  type="number"
                  name="sleep_quality"
                  min="1"
                  max="10"
                  value={form.sleep_quality}
                  onChange={handleChange}
                  placeholder="Example: 8"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Bedtime
                </label>

                <input
                  type="time"
                  name="bedtime"
                  value={form.bedtime}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Wake-up time
                </label>

                <input
                  type="time"
                  name="wake_time"
                  value={form.wake_time}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

          </section>


          {/* ========================= */}
          {/* ACTIVITY */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>🏃</span>

              <div>

                <h2>
                  Activity & Movement
                </h2>

                <p>
                  Understand how active your day was.
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Steps
                </label>

                <input
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

                <label>
                  Exercise (minutes)
                </label>

                <input
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

                <label>
                  Sitting time (hours)
                </label>

                <input
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


          {/* ========================= */}
          {/* BODY */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>❤️</span>

              <div>

                <h2>
                  Body & Heart
                </h2>

                <p>
                  Record your basic physical measurements.
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Resting heart rate (bpm)
                </label>

                <input
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

                <label>
                  Weight (kg)
                </label>

                <input
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


          {/* ========================= */}
          {/* HYDRATION */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>💧</span>

              <div>

                <h2>
                  Hydration & Nutrition
                </h2>

                <p>
                  Track basic daily habits.
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Water intake (litres)
                </label>

                <input
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

                <label>
                  Meals quality (1–10)
                </label>

                <input
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

                <label>
                  Caffeine servings
                </label>

                <input
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


          {/* ========================= */}
          {/* MENTAL WELLBEING */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>🧠</span>

              <div>

                <h2>
                  Mental Wellbeing
                </h2>

                <p>
                  How did you feel today?
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Stress level (1–10)
                </label>

                <input
                  type="number"
                  name="stress_score"
                  min="1"
                  max="10"
                  value={form.stress_score}
                  onChange={handleChange}
                  placeholder="Example: 5"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Mood (1–10)
                </label>

                <input
                  type="number"
                  name="mood_score"
                  min="1"
                  max="10"
                  value={form.mood_score}
                  onChange={handleChange}
                  placeholder="Example: 8"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Energy level (1–10)
                </label>

                <input
                  type="number"
                  name="energy_level"
                  min="1"
                  max="10"
                  value={form.energy_level}
                  onChange={handleChange}
                  placeholder="Example: 7"
                  required
                />

              </div>

            </div>

          </section>


          {/* ========================= */}
          {/* DIGITAL LIFESTYLE */}
          {/* ========================= */}

          <section className="form-section">

            <div className="section-heading">

              <span>📱</span>

              <div>

                <h2>
                  Digital Lifestyle
                </h2>

                <p>
                  Understand how screen usage affects your routine.
                </p>

              </div>

            </div>


            <div className="form-grid">

              <div className="form-group">

                <label>
                  Total screen time (hours)
                </label>

                <input
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

                <label>
                  Screen time before bed (hours)
                </label>

                <input
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


          {/* ========================= */}
          {/* SUBMIT */}
          {/* ========================= */}

          <div className="form-submit">

            <p>
              🔒 Your data is used to analyze personal
              lifestyle patterns. CarePulse AI does not
              provide medical diagnosis.
            </p>

            <button
              type="submit"
              disabled={loading}
            >
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

