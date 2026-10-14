
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Load pages only when users visit them.
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const HealthData = lazy(() => import("./pages/HealthData"));
const HealthHistory = lazy(() => import("./pages/HealthHistory"));

function PageLoading() {
  return (
    <div className="page-loading">
      <div className="page-loading-spinner" />
      <p>Loading CarePulse AI...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health-data" element={<HealthData />} />
          <Route path="/health-history" element={<HealthHistory />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;