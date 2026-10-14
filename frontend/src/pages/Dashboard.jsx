import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../services/api";

import "./Dashboard.css";


function Dashboard() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [healthData, setHealthData] = useState(null);
  const [healthHistory, setHealthHistory] = useState([]);

  const [lifestyleScore, setLifestyleScore] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [healthPrediction, setHealthPrediction] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [healthRisk, setHealthRisk] = useState(null);
  const [healthRiskTrend, setHealthRiskTrend] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [mlPredictionHistory, setMlPredictionHistory] = useState([]);
const [mlHistoryLoading, setMlHistoryLoading] = useState(false);
const [mlHistoryError, setMlHistoryError] = useState("");
  const [mlPredictionLoading, setMlPredictionLoading] = useState(false);
  const [mlPredictionError, setMlPredictionError] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  const userName =
    localStorage.getItem("userName") || "User";

const fetchMlPredictionHistory = async () => {
  const storedUserId = localStorage.getItem("userId");
  const userId = Number(storedUserId);

  if (
    !storedUserId ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    setMlPredictionHistory([]);
    setMlHistoryError(
      "User session not found. Please log in again."
    );
    return;
  }

  setMlHistoryLoading(true);
  setMlHistoryError("");

  try {
    const response = await api.get("/ml/prediction-history", {
      params: {
        user_id: userId,
        limit: 20,
      },
    });

    setMlPredictionHistory(
      Array.isArray(response.data?.history)
        ? response.data.history
        : []
    );
  } catch (error) {
    console.error("ML prediction history error:", error);

    setMlHistoryError(
      error.response?.data?.detail ||
        "Could not load ML prediction history."
    );
  } finally {
    setMlHistoryLoading(false);
  }
};
useEffect(() => {
  fetchMlPredictionHistory();
}, []);

  // =========================================================
  // LOAD DASHBOARD
  // ========================================================

  useEffect(() => {

    if (!userId) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {

      try {

        setLoading(true);


        // =====================================================
        // HEALTH RECORDS
        // =====================================================

        const healthResponse = await api.get(
          "/health-records",
          {
            params: {
              user_id: userId,
            },
          }
        );

        const records = Array.isArray(
          healthResponse.data
        )
          ? healthResponse.data
          : [];

        const sortedRecords = [...records].sort(
          (a, b) =>
            new Date(a.date) -
            new Date(b.date)
        );

        console.log(
          "Health Records:",
          sortedRecords
        );

        setHealthHistory(
          sortedRecords
        );

        if (sortedRecords.length > 0) {

          setHealthData(
            sortedRecords[
              sortedRecords.length - 1
            ]
          );

        } else {

          setHealthData(null);

        }


        // =====================================================
        // LIFESTYLE SCORE
        // =====================================================

        try {

          const response =
            await api.get(
              "/lifestyle-score",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "Lifestyle Score:",
            response.data
          );

          setLifestyleScore(
            response.data
          );

        } catch (error) {

          console.error(
            "Lifestyle Score Error:",
            error
          );

        }


        // =====================================================
        // ANOMALIES
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-anomalies",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "Health Anomalies:",
            response.data
          );

          setAnomalies(
            response.data?.anomalies || []
          );

        } catch (error) {

          console.error(
            "Anomaly Error:",
            error
          );

          setAnomalies([]);

        }


        // =====================================================
        // PERSONAL BASELINE
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-baseline",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "Personal Baseline:",
            response.data
          );

          setBaseline(
            response.data
          );

        } catch (error) {

          console.error(
            "Baseline Error:",
            error
          );

        }


        // =====================================================
        // AI INSIGHT
        // =====================================================

        try {

          const response =
            await api.get(
              "/ai-insight",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "AI Insight:",
            response.data
          );

          setAiInsight(
            response.data
          );

        } catch (error) {

          console.error(
            "AI Insight Error:",
            error
          );

        }


        // =====================================================
        // AI RECOMMENDATIONS
        // =====================================================

        try {

          const response =
            await api.get(
              "/ai-recommendations",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "AI Recommendations:",
            response.data
          );

          const recommendationData =
            Array.isArray(response.data)
              ? response.data
              : response.data?.recommendations ||
                [];

          setRecommendations(
            recommendationData
          );

        } catch (error) {

          console.error(
            "AI Recommendations Error:",
            error
          );

          setRecommendations([]);

        }


        // =====================================================
        // HEALTH PREDICTION
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-prediction",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "Health Prediction:",
            response.data
          );

          setHealthPrediction(
            response.data
          );

        } catch (error) {

          console.error(
            "Health Prediction Error:",
            error
          );

        }


        // =====================================================
        // AI TREND ANALYSIS
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-trend-analysis",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "AI Trend Analysis:",
            response.data
          );

          setTrendAnalysis(
            response.data
          );

        } catch (error) {

          console.error(
            "Trend Analysis Error:",
            error
          );

        }


        // =====================================================
        // AI HEALTH RISK SCORE
        // =====================================================

                // =====================================================
        // AI HEALTH RISK
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-risk-score",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "AI Health Risk:",
            response.data
          );

          setHealthRisk(
            response.data
          );

        } catch (error) {

          console.error(
            "AI Health Risk Error:",
            error
          );

          setHealthRisk(null);

        }


        // =====================================================
        // AI HEALTH RISK TREND
        // =====================================================

        try {

          const response =
            await api.get(
              "/health-risk-trend",
              {
                params: {
                  user_id: userId,
                },
              }
            );

          console.log(
            "AI Health Risk Trend:",
            response.data
          );

          setHealthRiskTrend(
            response.data
          );

        } catch (error) {

          console.error(
            "AI Health Risk Trend Error:",
            error
          );

          setHealthRiskTrend(null);

        }

      } catch (error) {

        console.error(
          "Dashboard Error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, [navigate, userId]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "userName"
    );

    localStorage.removeItem(
      "userEmail"
    );

    navigate("/login");

  };


  // =========================================================
  // DATE FORMATTERS
  // =========================================================

  const formatChartDate = (date) => {

    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
      }
    );

  };


  const formatTooltipDate = (date) => {

    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =========================================================
  // NUMBER FORMATTERS
  // =========================================================

  const formatNumber = (value) => {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return Number(value).toLocaleString(
      "en-IN"
    );

  };


  const formatDecimal = (
    value,
    decimals = 1
  ) => {

    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "--";
    }

    return Number(value).toFixed(
      decimals
    );

  };


  // =========================================================
  // CLEAN TREND MESSAGE
  // =========================================================

  const cleanTrendMessage = (
    message
  ) => {

    if (!message) {
      return "";
    }

    return message
      .replace(
        /(\d+)\.0(?=\s|\/|→)/g,
        "$1"
      )
      .replace(
        /(\d+)\.0(?=\s*steps)/g,
        "$1"
      );

  };


  // =========================================================
  // HEALTH TRENDS CHART DATA
  // =========================================================

  const chartData = healthHistory
    .map((record) => ({

      date: record.date,

      heart_rate:
        record.heart_rate !== null &&
        record.heart_rate !== undefined
          ? Number(record.heart_rate)
          : null,

      sleep_hours:
        record.sleep_hours !== null &&
        record.sleep_hours !== undefined
          ? Number(record.sleep_hours)
          : null,

      steps:
        record.steps !== null &&
        record.steps !== undefined
          ? Number(record.steps)
          : null,

      water_intake:
        record.water_intake !== null &&
        record.water_intake !== undefined
          ? Number(record.water_intake)
          : null,

      stress_score:
        record.stress_score !== null &&
        record.stress_score !== undefined
          ? Number(record.stress_score)
          : null,

      mood_score:
        record.mood_score !== null &&
        record.mood_score !== undefined
          ? Number(record.mood_score)
          : null,

    }))
    .filter(
      (record) =>
        record.date
    );


  console.log(
    "Chart Data:",
    chartData
  );


  // =========================================================
  // AI WARNING STATUS
  // =========================================================

  const insightMessages = [

    ...(aiInsight?.insights || []),

    ...(aiInsight?.patterns || []),

  ];


  const hasInsightWarning =
    insightMessages.length > 0 &&
    !insightMessages.every(
      (message) =>
        message
          .toLowerCase()
          .includes(
            "close to your personal baseline"
          )
    );


  const hasAnomaly =
    anomalies.length > 0;


  const hasAttention =
    hasAnomaly ||
    hasInsightWarning;


  // =========================================================
  // EXPERIMENTAL ML LIFESTYLE PREDICTION
  // =========================================================
const handleMlPrediction = async () => {
  if (!healthData) {
    setMlPredictionError(
      "No health record available. Please add a health record first."
    );
    return;
  }

  const requiredFields = [
    "sleep_hours",
    "steps",
    "exercise_minutes",
    "water_intake",
    "stress_score",
    "mood_score",
    "screen_time",
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      healthData[field] === null ||
      healthData[field] === undefined ||
      healthData[field] === ""
  );

  if (missingFields.length > 0) {
    setMlPrediction(null);
    setMlPredictionError(
      `Missing health data: ${missingFields.join(", ")}`
    );
    return;
  }

  const storedUserId = localStorage.getItem("userId");
  const userId = Number(storedUserId);

  if (
    !storedUserId ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    setMlPrediction(null);
    setMlPredictionError(
      "User session not found. Please log out and log in again."
    );
    return;
  }

  const payload = {
    user_id: userId,
    sleep_hours: Number(healthData.sleep_hours),
    steps: Number(healthData.steps),
    exercise_minutes: Number(healthData.exercise_minutes),
    water_intake: Number(healthData.water_intake),
    stress_score: Number(healthData.stress_score),
    mood_score: Number(healthData.mood_score),
    screen_time: Number(healthData.screen_time),
  };

  const hasInvalidNumber = Object.values(payload).some(
    (value) => !Number.isFinite(value)
  );

  if (hasInvalidNumber) {
    setMlPrediction(null);
    setMlPredictionError(
      "Some health fields contain invalid numbers. Please check your latest health record."
    );
    return;
  }

  setMlPredictionLoading(true);
  setMlPredictionError("");
  setMlPrediction(null);

  try {
   const response = await api.post("/ml/predict", payload);
setMlPrediction(response.data);
await fetchMlPredictionHistory();
  } catch (error) {
    console.error("ML prediction error:", error);

    setMlPredictionError(
      error.response?.data?.detail ||
        "Prediction failed. Check that the backend is running on port 8001 and try again."
    );
  } finally {
    setMlPredictionLoading(false);
  }
};



  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="dashboard">

        <div className="dashboard-content">

          <div className="dashboard-card loading-card">

            <h3>
              Loading CarePulse AI...
            </h3>

            <p>
              Analyzing your health and lifestyle data.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // =========================================================
  // NO DATA
  // =========================================================

  if (!healthData) {

    return (

      <div className="dashboard">

        <header className="dashboard-header">

          <div className="brand-area">

            <h1>
              CarePulse AI
            </h1>

            <p>
              Personal Health Dashboard
            </p>

          </div>


          <div className="dashboard-actions">

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/health-data"
                )
              }
            >
              + Enter Health Data
            </button>


            <button
              className="history-btn"
              onClick={() =>
                navigate(
                  "/health-history"
                )
              }
            >
              📋 Health History
            </button>


            <button
              className="primary-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </header>


        <main className="dashboard-content">

          <section className="welcome-section">

            <h2>
              Welcome Back, {userName} 👋
            </h2>

            <p>
              You haven't added any health data yet.
              Start by entering your first health record.
            </p>

          </section>


          <div className="dashboard-card empty-state">

            <h3>
              📊 No Health Records
            </h3>

            <p>
              Add your health information to unlock
              personalized AI insights, anomaly detection,
              baseline analysis, recommendations, and trends.
            </p>

            <button
              className="secondary-btn"
              onClick={() =>
                navigate(
                  "/health-data"
                )
              }
            >
              + Add Health Data
            </button>

          </div>

        </main>

      </div>

    );

  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  return (

    <div className="dashboard">

      <header className="dashboard-header">

        <div className="brand-area">

          <h1>
            CarePulse AI
          </h1>

          <p>
            Personal Health Dashboard
          </p>

        </div>


        <div className="dashboard-actions">

          <button
            className="secondary-btn"
            onClick={() =>
              navigate(
                "/health-data"
              )
            }
          >
            + Enter Health Data
          </button>


          <button
            className="history-btn"
            onClick={() =>
              navigate(
                "/health-history"
              )
            }
          >
            📋 Health History
          </button>


          <button
            className="primary-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="dashboard-content">


        {/* ===================================================
            WELCOME
        =================================================== */}

        <section className="welcome-section">

          <h2>
            Welcome Back 👋
          </h2>

          <p>
            Here's an overview of your health and
            lifestyle patterns.
          </p>

        </section>


        {/* ===================================================
            TODAY'S HEALTH
        =================================================== */}

        <section>

          <h2>
            📋 Today's Health
          </h2>

          <p>
            Your latest recorded health measurements.
          </p>


          <div className="health-grid">


            <div className="dashboard-card">

              <h3>
                ❤️ Heart Rate
              </h3>

              <strong>
                {healthData.heart_rate ?? "--"} BPM
              </strong>

              <p>
                Latest recorded heart rate
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                😴 Sleep
              </h3>

              <strong>
                {healthData.sleep_hours ?? "--"} hrs
              </strong>

              <p>
                Latest recorded sleep
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                🚶 Steps
              </h3>

              <strong>
                {formatNumber(
                  healthData.steps
                )}
              </strong>

              <p>
                Latest recorded steps
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                💧 Water
              </h3>

              <strong>
                {healthData.water_intake ?? "--"} L
              </strong>

              <p>
                Latest recorded water intake
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                ⚖️ Weight
              </h3>

              <strong>
                {healthData.weight ?? "--"} kg
              </strong>

              <p>
                Latest recorded weight
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                😰 Stress
              </h3>

              <strong>
                {healthData.stress_score ?? "--"}/10
              </strong>

              <p>
                Latest stress score
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                😊 Mood
              </h3>

              <strong>
                {healthData.mood_score ?? "--"}/10
              </strong>

              <p>
                Latest mood score
              </p>

            </div>


            <div className="dashboard-card lifestyle-score-card">

              <h3>
                🌱 Lifestyle Score
              </h3>

              <strong>
                {lifestyleScore?.score ?? "--"}/100
              </strong>

              <p>
                {lifestyleScore?.category ||
                  "Analyzing"}
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            EXPERIMENTAL ML MODEL PREDICTION
        =================================================== */}

        <section className="ai-section">

          <h2>🧪 Experimental ML Model Prediction</h2>

          <p>
            Run the demonstration machine-learning model using your latest
            recorded lifestyle data.
          </p>

          <div className="ai-card">

            <button
              type="button"
              className="secondary-btn"
              onClick={handleMlPrediction}
              disabled={mlPredictionLoading}
            >
              {mlPredictionLoading
                ? "Analyzing..."
                : "Run ML Prediction"}
            </button>

            {mlPredictionError && (
              <p role="alert" className="ai-disclaimer">
                {mlPredictionError}
              </p>
            )}

            {mlPrediction && (
              <div className="ai-card-content">
                <h3>
                  Model Output: {mlPrediction.label_description || "Prediction returned"}
                </h3>

                <p>
                  Predicted label: {mlPrediction.predicted_label ?? "--"}
                </p>

                <p>
                  Model confidence: {Number.isFinite(Number(mlPrediction.model_confidence))
                    ? `${(Number(mlPrediction.model_confidence) * 100).toFixed(0)}%`
                    : "--"}
                </p>

                <p>
                  Model type: {mlPrediction.model_type || "Not specified"}
                </p>

                <p className="ai-disclaimer">
                  {mlPrediction.data_note ||
                    "This is an experimental demonstration model, not a medical assessment."}
                </p>
              </div>
            )}

            <p className="ai-disclaimer">
              This model uses synthetic demonstration data and has not been clinically
              validated. Its output is not a diagnosis, a medical recommendation, or
              a reliable assessment of your health. Do not use it for medical decisions.
            </p>

<section className="ml-prediction-history-card">
<div className="ml-prediction-history-header">
  <h2>ML Prediction History</h2>

  <button
    type="button"
    onClick={fetchMlPredictionHistory}
    disabled={mlHistoryLoading}
  >
    {mlHistoryLoading ? "Refreshing..." : "Refresh History"}
  </button>
</div>

  <p>
    Your latest saved machine learning predictions.
  </p>

  {mlHistoryLoading && (
    <p>Loading prediction history...</p>
  )}

  {!mlHistoryLoading && mlHistoryError && (
    <p role="alert">
      {mlHistoryError}
    </p>
  )}

  {!mlHistoryLoading &&
    !mlHistoryError &&
    mlPredictionHistory.length === 0 && (
      <p>No saved predictions yet. Run an ML prediction first.</p>
    )}

  {!mlHistoryLoading &&
    mlPredictionHistory.length > 0 && (
      <div className="ml-prediction-history-list">
        {mlPredictionHistory.map((record) => (
          <article
            className="ml-prediction-history-item"
            key={record.history_id}
          >
            <h3>{record.label_description}</h3>

            <p>
              <strong>Prediction ID:</strong>{" "}
              {record.history_id}
            </p>

            <p>
              <strong>Model:</strong>{" "}
              {record.model_type}
            </p>

            <p>
              <strong>Confidence:</strong>{" "}
              {Number.isFinite(Number(record.model_confidence))
                ? `${Math.round(
                    Number(record.model_confidence) * 100
                  )}%`
                : "N/A"}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {record.created_at
                ? new Date(record.created_at).toLocaleString()
                : "Unavailable"}
            </p>

            {record.data_note && (
              <p>{record.data_note}</p>
            )}
          </article>
        ))}
      </div>
    )}
</section>

          </div>

        </section>


        {/* ===================================================
            AI HEALTH TREND PREDICTION
        =================================================== */}

        {healthPrediction && (

          <section className="ai-section">

            <h2>
              🔮 AI Health Trend Prediction
            </h2>

            <p>
              CarePulse AI analyzes your recent lifestyle
              patterns to estimate your current health trend.
            </p>


            <div className="ai-card">

              <div className="ai-card-header">

                <h3>

                  {healthPrediction.prediction ===
                  "Needs Attention"
                    ? "⚠️"
                    : "✅"}{" "}

                  {healthPrediction.prediction}

                </h3>


                <span className="status-badge">

                  {healthPrediction.confidence}%
                  Confidence

                </span>

              </div>


              <p>
                {healthPrediction.message}
              </p>


              {healthPrediction.factors &&
                healthPrediction.factors.length > 0 && (

                  <>

                    <h3 className="anomaly-title">
                      🔍 Prediction Factors
                    </h3>


                    <ul className="ai-insights-list">

                      {healthPrediction.factors.map(
                        (factor, index) => (

                          <li key={index}>
                            {factor}
                          </li>

                        )
                      )}

                    </ul>

                  </>

                )}


              <p className="ai-disclaimer">

                This prediction represents a lifestyle
                trend analysis based on your recorded
                health data. It is not a medical diagnosis
                or medical prediction.

              </p>

            </div>

          </section>

        )}


    {/* =========================================================
    AI HEALTH RISK SCORE
    ========================================================= */}

{healthRisk && (
  <section className="ai-section">

    <h2>🧠 AI Health Risk Score</h2>

    <p>
      CarePulse AI analyzes your recent lifestyle patterns
      and identifies factors that may require attention.
    </p>

    <div className="ai-card health-risk-card">

      <div className="health-risk-header">

        <div>

          <h3>
            {healthRisk.risk_level === "Low"
              ? "🟢"
              : healthRisk.risk_level === "Moderate"
              ? "🟠"
              : "🔴"}{" "}
            {healthRisk.risk_level}
          </h3>

          <p>
            {healthRisk.summary}
          </p>

        </div>

        <div className="health-risk-score">

          <strong>
            {healthRisk.risk_score}
          </strong>

          <span>
            / 100
          </span>

          <small>
            Risk Score
          </small>

        </div>

      </div>

      {/* =====================================================
          RISK FACTORS
          ===================================================== */}

      {healthRisk.factors &&
        healthRisk.factors.length > 0 && (

          <div className="health-risk-factors">

            <h3>📊 Risk Factors</h3>

            <div className="health-risk-factor-list">

              {healthRisk.factors.map(
                (factor, index) => (

                  <div
                    className="health-risk-factor"
                    key={index}
                  >

                    <div className="health-risk-factor-top">

                      <strong>
                        {factor.factor}
                      </strong>

                      <span>
                        {factor.risk}/100
                      </span>

                    </div>

                    <div className="health-risk-factor-bar">

                      <div
                        className="health-risk-factor-fill"
                        style={{
                          width: `${factor.risk}%`
                        }}
                      />

                    </div>

                    <p>
                      {factor.message}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      {/* =====================================================
          DISCLAIMER
          ===================================================== */}

      {healthRisk.disclaimer && (

        <div className="health-risk-disclaimer">

          <strong>ℹ️ Note:</strong>{" "}
          {healthRisk.disclaimer}

        </div>

      )}

    </div>

  </section>
)}


{/* =========================================================
    AI HEALTH RISK TREND
    ========================================================= */}

{healthRiskTrend && (
  <section className="ai-section">

    <h2>📈 AI Health Risk Trend</h2>

    <p>
      CarePulse AI analyzes how your lifestyle risk
      indicator is changing over your recorded health data.
    </p>

    <div className="ai-card health-risk-trend-card">

      <div className="health-risk-trend-header">

        <div>

          <h3>
            {healthRiskTrend.direction === "improving"
              ? "🟢"
              : healthRiskTrend.direction === "worsening"
              ? "🔴"
              : "🟠"}{" "}
            {healthRiskTrend.trend || "Stable"}
          </h3>

          <p>
            {healthRiskTrend.message ||
              "Analyzing your health risk trend."}
          </p>

        </div>

        <div className="health-risk-change">

          <strong>
            {healthRiskTrend.change > 0
              ? `+${healthRiskTrend.change}`
              : healthRiskTrend.change}
          </strong>

          <span>
            risk change
          </span>

        </div>

      </div>
{healthRiskTrend.history &&
  healthRiskTrend.history.length > 0 && (
    <div className="health-risk-history">
      <h3>📊 Risk History</h3>

      <div className="health-risk-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={healthRiskTrend.history}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              label={{
                value: "Risk Score",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                `${value}/100`,
                "Risk Score",
              ]}
            />

            <Line
              type="monotone"
              dataKey="risk_score"
              stroke="#e74c3c"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )}

    </div>

  </section>
)}

        {/* ===================================================
            HEALTH PATTERNS
        =================================================== */}

        <section className="ai-section">

          <h2>
            🚨 Health Patterns Detected
          </h2>

          <p>
            CarePulse AI detected some unusual patterns
            in your latest health data.
          </p>


          {anomalies.length > 0 ? (

            <div className="anomaly-list">

              {anomalies.map(
                (anomaly, index) => (

                  <div
                    className="anomaly-card"
                    key={index}
                  >

                    <div className="anomaly-card-header">

                      <h3>
                        ⚠️ {anomaly.type}
                      </h3>


                      <span
                        className={`severity-badge ${
                          anomaly.severity
                            ? anomaly.severity.toLowerCase()
                            : ""
                        }`}
                      >
                        {anomaly.severity}
                      </span>

                    </div>


                    <p>
                      {anomaly.message}
                    </p>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="ai-card">

              <h3>
                ✅ No unusual patterns detected
              </h3>

              <p>
                Your latest measurements are currently
                within your personal pattern range.
              </p>

            </div>

          )}


          <div className="anomaly-status">

            <span className="status-badge">

              {anomalies.length} Pattern
              {anomalies.length !== 1
                ? "s"
                : ""}

            </span>


            <span className="pattern-count">
              Detected
            </span>


            <span className="status-description">

              These are lifestyle-pattern alerts for
              awareness only and are not a medical
              diagnosis.

            </span>

          </div>

        </section>


        {/* ===================================================
            PERSONAL BASELINE
        =================================================== */}

        {baseline && (

          <section className="ai-section">

            <h2>
              🧠 Your Personal Baseline
            </h2>

            <p>
              Your baseline represents your usual lifestyle
              pattern based on your recorded health history.
            </p>


            <div className="health-grid">


              <div className="dashboard-card">

                <h3>
                  😴 Average Sleep
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_sleep,
                    2
                  )} hrs

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  🚶 Average Steps
                </h3>

                <strong>

                  {formatNumber(
                    Math.round(
                      baseline.average_steps || 0
                    )
                  )}

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  ❤️ Average Heart Rate
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_heart_rate,
                    1
                  )} BPM

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  💧 Average Water
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_water,
                    2
                  )} L

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  ⚖️ Average Weight
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_weight,
                    1
                  )} kg

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  😰 Average Stress
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_stress,
                    1
                  )}/10

                </strong>

              </div>


              <div className="dashboard-card">

                <h3>
                  😊 Average Mood
                </h3>

                <strong>

                  {formatDecimal(
                    baseline.average_mood,
                    1
                  )}/10

                </strong>

              </div>

            </div>

          </section>

        )}


        {/* ===================================================
            AI TREND ANALYSIS
        =================================================== */}

        {trendAnalysis && (

          <section className="ai-section">

            <h2>
              📈 AI Trend Analysis
            </h2>

            <p>
              CarePulse AI analyzes the direction of your
              recent health measurements.
            </p>


            {trendAnalysis.trends &&
              trendAnalysis.trends.length > 0 && (

                <div className="health-grid">

                  {trendAnalysis.trends.map(
                    (trend, index) => {

                      let icon = "📊";


                      if (
                        trend.metric ===
                        "Sleep"
                      ) {
                        icon = "😴";
                      }


                      if (
                        trend.metric ===
                        "Activity"
                      ) {
                        icon = "🚶";
                      }


                      if (
                        trend.metric ===
                        "Hydration"
                      ) {
                        icon = "💧";
                      }


                      if (
                        trend.metric ===
                        "Stress"
                      ) {
                        icon = "😰";
                      }


                      if (
                        trend.metric ===
                        "Mood"
                      ) {
                        icon = "😊";
                      }


                      let directionIcon = "→";


                      if (
                        trend.direction ===
                        "Increasing"
                      ) {
                        directionIcon = "↗";
                      }


                      if (
                        trend.direction ===
                        "Decreasing"
                      ) {
                        directionIcon = "↘";
                      }


                      return (

                        <div
                          className="dashboard-card"
                          key={index}
                        >

                          <h3>
                            {icon}{" "}
                            {trend.metric}
                          </h3>


                          <strong>

                            {directionIcon}{" "}
                            {trend.direction}

                          </strong>


                          <p>

                            {cleanTrendMessage(
                              trend.message
                            )}

                          </p>

                        </div>

                      );

                    }
                  )}

                </div>

              )}


            {trendAnalysis.summary && (

              <div className="ai-card trend-summary-card">

                <h3>
                  🧠 Recent Trend Summary
                </h3>

                <p>

                  {cleanTrendMessage(
                    trendAnalysis.summary
                  )}

                </p>

              </div>

            )}


            <p className="ai-disclaimer">

              Trend analysis is based on your recorded
              lifestyle data and is intended for awareness
              only.

            </p>

          </section>

        )}


        {/* ===================================================
            HEALTH PATTERN SUMMARY
        =================================================== */}

        <section className="ai-section">

          <h2>
            🧩 Health Pattern Summary
          </h2>

          <p>
            A quick summary of what CarePulse AI currently
            understands from your health history.
          </p>


          <div className="health-grid">


            <div className="dashboard-card">

              <h3>
                📌 Overall Status
              </h3>

              <strong>

                {hasAttention
                  ? "Attention"
                  : "Stable"}

              </strong>

              <p>

                {hasAttention
                  ? "Some patterns need your attention."
                  : "Your current patterns are relatively stable."}

              </p>

            </div>


            <div className="dashboard-card lifestyle-score-card">

              <h3>
                🌱 Lifestyle
              </h3>

              <strong>

                {lifestyleScore?.score ?? "--"}/100

              </strong>

              <p>

                {lifestyleScore?.category ||
                  "Analyzing"}

              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                📚 Records Analyzed
              </h3>

              <strong>
                {healthHistory.length}
              </strong>

              <p>
                Health records available for analysis
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                ⚠️ Warning Factors
              </h3>

              <strong>
                {anomalies.length}
              </strong>

              <p>
                Factors detected in latest record
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                🤖 AI Patterns
              </h3>

              <strong>

                {aiInsight?.patterns?.length || 0}

              </strong>

              <p>
                Personalized relationships detected
              </p>

            </div>


            <div className="dashboard-card">

              <h3>
                📅 Latest Record
              </h3>

              <strong>
                {healthData.date}
              </strong>

              <p>
                Most recent health data analyzed
              </p>

            </div>

          </div>

        </section>


        {/* ===================================================
            AI SUMMARY
        =================================================== */}

        {aiInsight && (

          <section className="ai-section">

            <div className="ai-card">

              <h2>
                🤖 CarePulse AI Summary
              </h2>


              <p>

                {aiInsight.message ||
                  aiInsight.insights?.join(" ") ||
                  "No additional insights available."}

              </p>


              <p className="ai-disclaimer">

                This system identifies lifestyle patterns
                for awareness and monitoring. It is not a
                medical diagnosis.

              </p>

            </div>

          </section>

        )}


        {/* ===================================================
            AI RECOMMENDATIONS
        =================================================== */}

        <section className="ai-section">

          <h2>
            💡 Personalized AI Recommendations
          </h2>

          <p>

            CarePulse AI analyzes your latest health
            measurements and personal baseline to provide
            lifestyle recommendations.

          </p>


          {recommendations.length > 0 ? (

            <div className="anomaly-list">

              {recommendations.map(
                (recommendation, index) => {

                  const recommendationType =
                    recommendation.type ||
                    recommendation.category ||
                    "Lifestyle";


                  let icon = "🌱";


                  if (
                    recommendationType ===
                    "Sleep"
                  ) {
                    icon = "😴";
                  }


                  if (
                    recommendationType ===
                    "Hydration"
                  ) {
                    icon = "💧";
                  }


                  if (
                    recommendationType ===
                    "Activity"
                  ) {
                    icon = "🚶";
                  }


                  if (
                    recommendationType ===
                    "Exercise"
                  ) {
                    icon = "🏃";
                  }


                  if (
                    recommendationType ===
                    "Stress"
                  ) {
                    icon = "😰";
                  }


                  if (
                    recommendationType ===
                    "Recovery"
                  ) {
                    icon = "🧘";
                  }


                  return (

                    <div
                      className="anomaly-card recommendation-card"
                      key={index}
                    >

                      <div className="anomaly-card-header">

                        <h3>

                          {icon}{" "}
                          {recommendationType}

                        </h3>


                        <span
                          className={`severity-badge ${
                            (
                              recommendation.priority ||
                              recommendation.severity ||
                              "Medium"
                            ).toLowerCase()
                          }`}
                        >

                          {recommendation.priority ||
                            recommendation.severity ||
                            "Medium"}

                        </span>

                      </div>


                      <p>

                        {recommendation.message ||
                          recommendation.description ||
                          recommendation.reason ||
                          ""}

                      </p>


                      {(recommendation.action ||
                        recommendation.recommended_action) && (

                        <p className="recommended-action">

                          <strong>
                            Recommended Action:
                          </strong>{" "}

                          {recommendation.action ||
                            recommendation.recommended_action}

                        </p>

                      )}

                    </div>

                  );

                }
              )}

            </div>

          ) : (

            <div className="ai-card">

              <h3>
                ✅ No new recommendations
              </h3>

              <p>

                Your current lifestyle measurements do
                not require any additional recommendations.

              </p>

            </div>

          )}


          <p className="ai-disclaimer">

            Recommendations are general lifestyle
            suggestions for awareness and are not medical
            advice or a medical diagnosis.

          </p>

        </section>


        {/* ===================================================
            HEALTH TRENDS
        =================================================== */}

        <section className="ai-section health-trends-section">

          <h2>
            📊 Health Trends
          </h2>

          <p>
            Visual trends based on your recorded health
            history.
          </p>


          {chartData.length >= 1 ? (

            <div
              className="charts-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                width: "100%",
                minWidth: 0,
                gap: "20px",
              }}
            >


              {/* =================================================
                  HEART RATE
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  ❤️ Heart Rate
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="heart_rate"
                      name="Heart Rate"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>


              {/* =================================================
                  SLEEP
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  😴 Sleep
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="sleep_hours"
                      name="Sleep"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>


              {/* =================================================
                  STEPS
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  🚶 Steps
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="steps"
                      name="Steps"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>


              {/* =================================================
                  WATER
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  💧 Water Intake
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="water_intake"
                      name="Water Intake"
                      stroke="#0891b2"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>


              {/* =================================================
                  STRESS
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  😰 Stress
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="stress_score"
                      name="Stress"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>


              {/* =================================================
                  MOOD
              ================================================= */}

              <div
                className="trend-card"
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >

                <h3>
                  😊 Mood
                </h3>


                <div
                  className="chart-container"
                  style={{
                    width: "100%",
                    minWidth: 0,
                    overflowX: "auto",
                    overflowY: "hidden",
                  }}
                >

                  <LineChart
                    width={700}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 10,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="date"
                      tickFormatter={
                        formatChartDate
                      }
                      interval="preserveStartEnd"
                      minTickGap={35}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={
                        formatTooltipDate
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="mood_score"
                      name="Mood"
                      stroke="#a855f7"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />

                  </LineChart>

                </div>

              </div>

            </div>

          ) : (

            <div className="ai-card">

              <h3>
                📊 Not enough chart data
              </h3>

              <p>

                Add health records containing sleep,
                activity, hydration, stress, mood, or
                heart-rate values to display your trends.

              </p>

            </div>

          )}


          <p className="ai-disclaimer">

            These charts visualize your recorded lifestyle
            measurements over time. They are intended for
            awareness and monitoring only.

          </p>

        </section>


        {/* ===================================================
            CAREPULSE AI INSIGHT
        =================================================== */}

        {aiInsight && (

          <section className="ai-section">

            <div className="ai-card">

              <h2>
                🤖 CarePulse AI Insight
              </h2>


              <div className="anomaly-status insight-status">

                <span className="status-badge">

                  {hasAttention
                    ? "⚠️ Health pattern requires attention"
                    : "✅ Health patterns look stable"}

                </span>

              </div>


              <p>

                CarePulse AI compared your latest health
                measurements with your personal baseline.

              </p>


              {aiInsight.insights &&
                aiInsight.insights.length > 0 && (

                  <>

                    <h3 className="anomaly-title">

                      🧠 Personalized Insights

                    </h3>


                    <ul className="ai-insights-list">

                      {aiInsight.insights.map(
                        (insight, index) => (

                          <li key={index}>
                            {insight}
                          </li>

                        )
                      )}

                    </ul>

                  </>

                )}


              {aiInsight.patterns &&
                aiInsight.patterns.length > 0 && (

                  <>

                    <h3 className="anomaly-title">

                      🧩 Personalized AI Patterns

                    </h3>


                    <ul className="ai-insights-list">

                      {aiInsight.patterns.map(
                        (pattern, index) => (

                          <li key={index}>
                            {pattern}
                          </li>

                        )
                      )}

                    </ul>

                  </>

                )}


              {anomalies.length > 0 && (

                <>

                  <h3 className="anomaly-title">

                    🚨 Detected Health Patterns

                  </h3>


                  <ul className="ai-insights-list">

                    {anomalies.map(
                      (anomaly, index) => (

                        <li key={index}>

                          <strong>
                            {anomaly.type}:
                          </strong>{" "}

                          {anomaly.message}

                        </li>

                      )
                    )}

                  </ul>

                </>

              )}


              <div className="anomaly-status final-status">

                <span className="status-badge">

                  {hasAttention
                    ? "ATTENTION"
                    : "STABLE"}

                </span>


                <span className="pattern-count">

                  {anomalies.length} Pattern
                  {anomalies.length !== 1
                    ? "s"
                    : ""}{" "}
                  Detected

                </span>

              </div>


              <p className="ai-disclaimer">

                AI insights are for health pattern
                monitoring only and are not a medical
                diagnosis.

              </p>

            </div>

          </section>

        )}

      </main>

    </div>

  );

}
export default Dashboard;