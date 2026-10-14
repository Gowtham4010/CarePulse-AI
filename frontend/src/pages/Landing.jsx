import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document
      .getElementById("about")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}

      <nav className="landing-navbar">

        <div
          className="logo"
          onClick={() => navigate("/")}
        >
          <strong>CarePulse AI</strong>
        </div>

        <div className="nav-links">

          <button onClick={scrollToFeatures}>
            Features
          </button>

          <button onClick={scrollToAbout}>
            About
          </button>

          <button onClick={() => navigate("/login")}>
            Login
          </button>

          <button
            className="nav-register"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-label">
            AI-POWERED HEALTH MONITORING
          </span>

          <h1>
            Understand Your Health
            <br />
            Before It Becomes a Problem.
          </h1>

          <p>
            CarePulse AI monitors your personal health patterns,
            detects unusual changes, and provides understandable
            AI-powered lifestyle insights.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Get Started →
            </button>

            <button
              className="secondary-btn"
              onClick={scrollToFeatures}
            >
              Learn More ↓
            </button>

          </div>

        </div>


        {/* ================= HERO HEALTH CARD ================= */}

        <div className="hero-health-card">

          <div className="hero-card-header">
            <span>Today's Health</span>
            <span className="normal-badge">
              ✓ Normal
            </span>
          </div>

          <div className="hero-metrics">

            <div>
              <span>❤️</span>
              <small>Heart Rate</small>
              <strong>72 BPM</strong>
            </div>

            <div>
              <span>😴</span>
              <small>Sleep</small>
              <strong>7.4 hrs</strong>
            </div>

            <div>
              <span>🚶</span>
              <small>Steps</small>
              <strong>6,842</strong>
            </div>

          </div>

          <div className="hero-status">
            ✓ Your patterns look normal
          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="features-section"
      >

        <div className="section-heading">

          <span>CAREPulse AI FEATURES</span>

          <h2>
            How CarePulse AI Helps
          </h2>

          <p>
            Turn your daily lifestyle data into meaningful,
            easy-to-understand health patterns.
          </p>

        </div>


        <div className="features-grid">

          {/* Health Patterns */}

          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Health Patterns
            </h3>

            <p>
              Track sleep, activity, hydration, stress,
              mood and other daily lifestyle measurements.
            </p>

            <button
              onClick={() => navigate("/health-data")}
            >
              Enter Health Data →
            </button>

          </div>


          {/* AI Detection */}

          <div className="feature-card">

            <div className="feature-icon">
              🤖
            </div>

            <h3>
              AI Detection
            </h3>

            <p>
              Machine learning compares your recent
              measurements with your personal baseline
              and identifies unusual lifestyle changes.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
            >
              View AI Detection →
            </button>

          </div>


          {/* AI Insights */}

          <div className="feature-card">

            <div className="feature-icon">
              💡
            </div>

            <h3>
              AI Insights
            </h3>

            <p>
              Receive simple explanations about important
              changes in your health and lifestyle patterns.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
            >
              View AI Insights →
            </button>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="about-section"
      >

        <div className="about-content">

          <span>
            ABOUT CAREPULSE AI
          </span>

          <h2>
            Your Personal Lifestyle
            Intelligence Platform
          </h2>

          <p>
            CarePulse AI is designed to help people understand
            their everyday lifestyle patterns through data.
          </p>

          <p>
            The platform collects daily information such as
            sleep, physical activity, hydration, stress, mood,
            screen time and other lifestyle factors.
          </p>

          <p>
            Machine learning is then used to identify unusual
            changes and compare them with the user's personal
            baseline.
          </p>

          <div className="about-warning">
            <strong>Important:</strong>
            CarePulse AI is a lifestyle monitoring and
            awareness platform. It does not provide medical
            diagnosis or replace professional medical advice.
          </div>

        </div>

      </section>


      {/* ================= CALL TO ACTION ================= */}

      <section className="cta-section">

        <h2>
          Start Understanding Your Health Patterns
        </h2>

        <p>
          Create your CarePulse AI account and begin
          recording your daily lifestyle data.
        </p>

        <button
          className="primary-btn"
          onClick={() => navigate("/register")}
        >
          Create Your Account →
        </button>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="landing-footer">

        <strong>
          CarePulse AI
        </strong>

        <span>
          Personalized Health Pattern Monitoring
        </span>

      </footer>

    </div>
  );
}

export default Landing;