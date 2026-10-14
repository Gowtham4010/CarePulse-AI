
import { useEffect, useState } from "react";

function changeValue(value, min, max, step = 1) {
  const change =
    Math.floor(Math.random() * (step * 2 + 1)) - step;

  return Math.max(min, Math.min(max, value + change));
}

function LiveHospitalMonitor() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString()
  );

  const [vitals, setVitals] = useState({
    heartRate: 72,
    oxygen: 98,
    systolic: 118,
    diastolic: 76,
    respiration: 16,
    temperature: 36.7,
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(new Date().toLocaleTimeString());

      setVitals((previous) => ({
        heartRate: changeValue(previous.heartRate, 65, 90, 2),
        oxygen: changeValue(previous.oxygen, 96, 100, 1),
        systolic: changeValue(previous.systolic, 110, 125, 2),
        diastolic: changeValue(previous.diastolic, 65, 82, 2),
        respiration: changeValue(previous.respiration, 12, 20, 1),
        temperature: Number(
          Math.max(
            36.3,
            Math.min(
              37.2,
              previous.temperature +
                (Math.floor(Math.random() * 3) - 1) * 0.1
            )
          ).toFixed(1)
        ),
      }));
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hospital-monitor-scene" aria-hidden="true">
      <div className="hospital-room-glow" />

      <div className="hospital-monitor">
        <div className="monitor-bezel">
          <div className="monitor-topbar">
            <span className="monitor-live-dot" />
            <span>PATIENT MONITOR</span>

            <span className="monitor-demo-badge">DEMO</span>
            <span className="monitor-clock">{clock}</span>
          </div>

          <div className="monitor-screen">
            <div className="monitor-wave-panel">
              <div className="monitor-label">
                ECG II · SIMULATED
              </div>

              <svg
                className="monitor-ecg"
                viewBox="0 0 700 200"
                preserveAspectRatio="none"
              >
                <path
                  className="ecg-base"
                  d="M0 100 H90 L112 96 L130 100 H175 L195 100 L215 43 L236 160 L260 20 L283 119 L306 100 H390 L410 96 L428 100 H470 L490 100 L510 43 L531 160 L555 20 L578 119 L602 100 H700"
                />

                <path
                  className="ecg-active"
                  d="M0 100 H90 L112 96 L130 100 H175 L195 100 L215 43 L236 160 L260 20 L283 119 L306 100 H390 L410 96 L428 100 H470 L490 100 L510 43 L531 160 L555 20 L578 119 L602 100 H700"
                />
              </svg>

              <div className="monitor-wave-footer">
                <span>LEAD II</span>
                <span>25 mm/s</span>
                <span>10 mm/mV</span>
              </div>
            </div>

            <div className="monitor-vitals">
              <div className="vital-reading vital-green">
                <span className="vital-label">HEART RATE</span>
                <div className="vital-number">
                  {vitals.heartRate}
                  <span className="vital-unit"> BPM</span>
                </div>
              </div>

              <div className="vital-reading vital-cyan">
                <span className="vital-label">SpO₂</span>
                <div className="vital-number">
                  {vitals.oxygen}
                  <span className="vital-unit"> %</span>
                </div>
              </div>

              <div className="vital-reading vital-blue">
                <span className="vital-label">BLOOD PRESSURE</span>
                <div className="vital-number">
                  {vitals.systolic}/{vitals.diastolic}
                </div>
                <span className="vital-small">mmHg · DEMO VALUE</span>
              </div>

              <div className="vital-reading vital-yellow">
                <span className="vital-label">RESPIRATION</span>
                <div className="vital-number">
                  {vitals.respiration}
                  <span className="vital-unit"> /min</span>
                </div>
              </div>

              <div className="vital-reading vital-cyan">
                <span className="vital-label">TEMPERATURE</span>
                <div className="vital-number">
                  {vitals.temperature.toFixed(1)}
                  <span className="vital-unit"> °C</span>
                </div>
              </div>
            </div>

            <div className="monitor-bottom-bar">
              <span>ECG</span>
              <span>SpO₂</span>
              <span>NIBP</span>
              <span>RESP</span>
              <span>TEMP</span>
            </div>
          </div>

          <div className="monitor-demo-note">
            SIMULATED VALUES · NO LIVE MEDICAL SENSOR CONNECTION
          </div>
        </div>
      </div>

      <div className="hospital-room-light" />
      <div className="hospital-room-overlay" />
    </div>
  );
}

export default LiveHospitalMonitor;