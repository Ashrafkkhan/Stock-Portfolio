import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";

// Simple premium placeholder for dashboard
function DashboardPlaceholder() {
  const { user } = useAuth();
  return (
    <div className="dashboard-placeholder">
      <div className="dashboard-card">
        <div className="dashboard-icon">🎉</div>
        <h2 className="dashboard-title">Successfully Authenticated!</h2>
        <p className="dashboard-text">
          Welcome back, <strong>{user?.full_name || user?.fullName || user?.name}</strong>.
        </p>
        <div className="dashboard-meta">
          <div className="meta-item">
            <span className="meta-label">Email</span>
            <span className="meta-value">{user?.email}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">User ID</span>
            <span className="meta-value">#{user?.id}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Session Status</span>
            <span className="meta-value status-active">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPlaceholder />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;