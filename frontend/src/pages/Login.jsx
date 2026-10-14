
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";
import LiveHospitalMonitor from "./LiveHospitalMonitor";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userEmail", response.data.email);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const loginSuccessful = message === "Login successful!";

  return (
    <main className="auth-page">
      <LiveHospitalMonitor />

      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            ✚
          </div>

          <div>
            <h1 className="auth-brand-name">CarePulse AI</h1>
            <p className="auth-brand-caption">
              Your personal lifestyle intelligence platform
            </p>
          </div>
        </div>

        <h2 className="auth-title">Welcome back!</h2>

        <p className="auth-subtitle">
          Sign in to explore your lifestyle patterns, dashboard,
          and AI-powered insights.
        </p>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`auth-message ${
                loginSuccessful ? "auth-success" : "auth-error"
              }`}
              role={loginSuccessful ? "status" : "alert"}
            >
              {message}
            </div>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing you in..." : "Sign In →"}
          </button>
        </form>

        
<div className="auth-footer">
  <span>Don't have an account?</span>

  <button
    type="button"
    className="auth-link"
    onClick={() => navigate("/register")}
    disabled={loading}
  >
    Create an account
  </button>
</div>

        <div className="auth-trust-note">
          Demonstration monitoring only. CarePulse AI does not provide
          medical diagnoses.
        </div>
      </section>
    </main>
  );
}

export default Login;