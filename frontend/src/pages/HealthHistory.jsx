
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HealthHistory.css";

function HealthHistory() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Edit states
  const [editingRecord, setEditingRecord] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const navigate = useNavigate();

  // =========================
  // FETCH HEALTH HISTORY
  // =========================

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get("/health-records", {
          params: {
            user_id: userId,
          },
        });

        const sortedRecords = [...response.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setRecords(sortedRecords);
      } catch (error) {
        console.error(
          "Failed to load health history:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // =========================
  // DELETE RECORD
  // =========================

  const deleteRecord = async (recordId) => {
    const userId = localStorage.getItem("userId");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/health-records/${recordId}`, {
        params: {
          user_id: userId,
        },
      });

      setRecords((currentRecords) =>
        currentRecords.filter(
          (record) => record.id !== recordId
        )
      );

      alert("Health record deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete health record.");
    }
  };

  // =========================
  // START EDITING
  // =========================

  const startEditing = (record) => {
    setEditingRecord({
      ...record,
      date: record.date || "",
      sleep_hours: record.sleep_hours ?? "",
      steps: record.steps ?? "",
      heart_rate: record.heart_rate ?? "",
      water_intake: record.water_intake ?? "",
      weight: record.weight ?? "",
      stress_score: record.stress_score ?? "",
      mood_score: record.mood_score ?? "",
      exercise_minutes: record.exercise_minutes ?? "",
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const cancelEditing = () => {
    setEditingRecord(null);
  };

  // =========================
  // HANDLE EDIT INPUT
  // =========================

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingRecord((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // SAVE EDIT
  // =========================

  const saveEdit = async (event) => {
    event.preventDefault();

    if (!editingRecord) {
      return;
    }

    const userId = localStorage.getItem("userId");

    setSavingEdit(true);

    try {
      const updatedData = {
        date: editingRecord.date,
        sleep_hours:
          editingRecord.sleep_hours === ""
            ? null
            : Number(editingRecord.sleep_hours),

        steps:
          editingRecord.steps === ""
            ? null
            : Number(editingRecord.steps),

        heart_rate:
          editingRecord.heart_rate === ""
            ? null
            : Number(editingRecord.heart_rate),

        water_intake:
          editingRecord.water_intake === ""
            ? null
            : Number(editingRecord.water_intake),

        weight:
          editingRecord.weight === ""
            ? null
            : Number(editingRecord.weight),

        stress_score:
          editingRecord.stress_score === ""
            ? null
            : Number(editingRecord.stress_score),

        mood_score:
          editingRecord.mood_score === ""
            ? null
            : Number(editingRecord.mood_score),

        exercise_minutes:
          editingRecord.exercise_minutes === ""
            ? null
            : Number(editingRecord.exercise_minutes),
      };

      const response = await api.put(
        `/health-records/${editingRecord.id}`,
        updatedData,
        {
          params: {
            user_id: userId,
          },
        }
      );

      // Update record in frontend
      setRecords((currentRecords) =>
        currentRecords
          .map((record) =>
            record.id === editingRecord.id
              ? response.data
              : record
          )
          .sort(
            (a, b) =>
              new Date(b.date) - new Date(a.date)
          )
      );

      setEditingRecord(null);

      alert("Health record updated successfully.");
    } catch (error) {
      console.error("Update failed:", error);

      alert("Failed to update health record.");
    } finally {
      setSavingEdit(false);
    }
  };

  // =========================
  // SUMMARY CALCULATIONS
  // =========================

  const totalRecords = records.length;

  const averageSleep =
    records.length > 0
      ? (
          records.reduce(
            (sum, record) =>
              sum + Number(record.sleep_hours || 0),
            0
          ) / records.length
        ).toFixed(1)
      : "--";

  const averageSteps =
    records.length > 0
      ? Math.round(
          records.reduce(
            (sum, record) =>
              sum + Number(record.steps || 0),
            0
          ) / records.length
        ).toLocaleString()
      : "--";

  const averageStress =
    records.length > 0
      ? (
          records.reduce(
            (sum, record) =>
              sum + Number(record.stress_score || 0),
            0
          ) / records.length
        ).toFixed(1)
      : "--";

  // =========================
  // DATE FILTER
  // =========================

  const filteredRecords = selectedDate
    ? records.filter(
        (record) => record.date === selectedDate
      )
    : records;

  // =========================
  // LOADING SCREEN
  // =========================

  if (loading) {
    return (
      <div className="health-history-container">
        <div className="history-header">
          <div>
            <h1>📋 Health History</h1>

            <p>
              Loading your health and lifestyle records...
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
            ← Dashboard
          </button>
        </div>

        <div className="no-history">
          <h2>Loading...</h2>

          <p>
            CarePulse AI is retrieving your health history.
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <div className="health-history-container">

      {/* HEADER */}

      <div className="history-header">
        <div>
          <h1>📋 Health History</h1>

          <p>
            View your previously recorded health
            and lifestyle data.
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="back-button"
        >
          ← Dashboard
        </button>
      </div>

      {/* SUMMARY CARDS */}

      {records.length > 0 && (
        <div className="history-summary-grid">

          <div className="history-summary-card">
            <span>📋</span>

            <p>Total Records</p>

            <strong>
              {totalRecords}
            </strong>
          </div>

          <div className="history-summary-card">
            <span>😴</span>

            <p>Average Sleep</p>

            <strong>
              {averageSleep} hrs
            </strong>
          </div>

          <div className="history-summary-card">
            <span>🚶</span>

            <p>Average Steps</p>

            <strong>
              {averageSteps}
            </strong>
          </div>

          <div className="history-summary-card">
            <span>😰</span>

            <p>Average Stress</p>

            <strong>
              {averageStress}/10
            </strong>
          </div>

        </div>
      )}

      {/* NO RECORDS */}

      {records.length === 0 ? (

        <div className="no-history">

          <h2>
            No Health Records Yet
          </h2>

          <p>
            Start recording your daily health
            information to build your personal
            health history.
          </p>

          <button
            onClick={() =>
              navigate("/health-data")
            }
          >
            + Enter Health Data
          </button>

        </div>

      ) : (

        <>

          {/* DATE FILTER */}

          <div className="history-filter">

            <div>

              <label htmlFor="history-date">
                📅 Filter by Date
              </label>

              <input
                id="history-date"
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
              />

            </div>

            {selectedDate && (
              <button
                className="clear-filter-button"
                onClick={() =>
                  setSelectedDate("")
                }
              >
                Clear Filter
              </button>
            )}

          </div>

          {/* FILTER RESULT */}

          {filteredRecords.length === 0 ? (

            <div className="no-history">

              <h2>
                No Record Found
              </h2>

              <p>
                There is no health record for
                the selected date.
              </p>

              <button
                onClick={() =>
                  setSelectedDate("")
                }
              >
                Show All Records
              </button>

            </div>

          ) : (

            <div className="health-history-list">

              {filteredRecords.map((record) => (

                <div
                  className="health-history-card"
                  key={record.id}
                >

                  {/* RECORD HEADER */}

                  <div className="record-header">

                    <div>

                      <h2>
                        📅 {record.date}
                      </h2>

                      <p className="record-id">
                        Health Record #{record.id}
                      </p>

                    </div>

                    <div className="record-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          startEditing(record)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteRecord(record.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                  {/* HEALTH METRICS */}

                  <div className="health-history-grid">

                    <div className="history-item">
                      <span>
                        ❤️ Heart Rate
                      </span>

                      <strong>
                        {record.heart_rate ?? "--"} BPM
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        😴 Sleep
                      </span>

                      <strong>
                        {record.sleep_hours ?? "--"} hrs
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        🚶 Steps
                      </span>

                      <strong>
                        {record.steps !== null &&
                        record.steps !== undefined
                          ? Number(
                              record.steps
                            ).toLocaleString()
                          : "--"}
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        💧 Water
                      </span>

                      <strong>
                        {record.water_intake ?? "--"} L
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        ⚖️ Weight
                      </span>

                      <strong>
                        {record.weight ?? "--"} kg
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        😰 Stress
                      </span>

                      <strong>
                        {record.stress_score ?? "--"}/10
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        😊 Mood
                      </span>

                      <strong>
                        {record.mood_score ?? "--"}/10
                      </strong>
                    </div>

                    <div className="history-item">
                      <span>
                        🏃 Exercise
                      </span>

                      <strong>
                        {record.exercise_minutes ?? "--"} min
                      </strong>
                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </>

      )}

      {/* =========================
          EDIT MODAL
          ========================= */}

      {editingRecord && (

        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>
                <h2>
                  ✏️ Edit Health Record
                </h2>

                <p>
                  Update your health information.
                </p>
              </div>

              <button
                className="close-edit-button"
                onClick={cancelEditing}
              >
                ×
              </button>

            </div>


            <form onSubmit={saveEdit}>

              {/* DATE */}

              <div className="edit-form-group">

                <label>
                  📅 Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={editingRecord.date}
                  onChange={handleEditChange}
                  required
                />

              </div>


              {/* FORM GRID */}

              <div className="edit-form-grid">

                {/* SLEEP */}

                <div className="edit-form-group">

                  <label>
                    😴 Sleep Hours
                  </label>

                  <input
                    type="number"
                    name="sleep_hours"
                    value={editingRecord.sleep_hours}
                    onChange={handleEditChange}
                    min="0"
                    max="24"
                    step="0.1"
                  />

                </div>


                {/* STEPS */}

                <div className="edit-form-group">

                  <label>
                    🚶 Steps
                  </label>

                  <input
                    type="number"
                    name="steps"
                    value={editingRecord.steps}
                    onChange={handleEditChange}
                    min="0"
                  />

                </div>


                {/* HEART RATE */}

                <div className="edit-form-group">

                  <label>
                    ❤️ Heart Rate
                  </label>

                  <input
                    type="number"
                    name="heart_rate"
                    value={editingRecord.heart_rate}
                    onChange={handleEditChange}
                    min="0"
                  />

                </div>


                {/* WATER */}

                <div className="edit-form-group">

                  <label>
                    💧 Water Intake (L)
                  </label>

                  <input
                    type="number"
                    name="water_intake"
                    value={editingRecord.water_intake}
                    onChange={handleEditChange}
                    min="0"
                    step="0.1"
                  />

                </div>


                {/* WEIGHT */}

                <div className="edit-form-group">

                  <label>
                    ⚖️ Weight (kg)
                  </label>

                  <input
                    type="number"
                    name="weight"
                    value={editingRecord.weight}
                    onChange={handleEditChange}
                    min="0"
                    step="0.1"
                  />

                </div>


                {/* STRESS */}

                <div className="edit-form-group">

                  <label>
                    😰 Stress Score
                  </label>

                  <input
                    type="number"
                    name="stress_score"
                    value={editingRecord.stress_score}
                    onChange={handleEditChange}
                    min="0"
                    max="10"
                  />

                </div>


                {/* MOOD */}

                <div className="edit-form-group">

                  <label>
                    😊 Mood Score
                  </label>

                  <input
                    type="number"
                    name="mood_score"
                    value={editingRecord.mood_score}
                    onChange={handleEditChange}
                    min="0"
                    max="10"
                  />

                </div>


                {/* EXERCISE */}

                <div className="edit-form-group">

                  <label>
                    🏃 Exercise (minutes)
                  </label>

                  <input
                    type="number"
                    name="exercise_minutes"
                    value={editingRecord.exercise_minutes}
                    onChange={handleEditChange}
                    min="0"
                  />

                </div>

              </div>


              {/* MODAL ACTIONS */}

              <div className="edit-modal-actions">

                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={cancelEditing}
                  disabled={savingEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-button"
                  disabled={savingEdit}
                >
                  {savingEdit
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default HealthHistory;