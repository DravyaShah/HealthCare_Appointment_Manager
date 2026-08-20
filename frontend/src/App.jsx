import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Team from './pages/Team';
import Blog from './pages/Blog';

// Protected Core Pages
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Appointments from './pages/Appointments';
import Patients from './pages/Patients';
import Reports from './pages/Reports';
import Prescriptions from './pages/Prescriptions';
import AIInsights from './pages/AIInsights';
import Profile from './pages/Profile';

// Layouts
import DoctorLayout from './layouts/DoctorLayout';
import PatientLayout from './layouts/PatientLayout';

// Loading Spinner
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'} replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/team" element={<Team />} />
      <Route path="/blog" element={<Blog />} />

      {/* Doctor Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patients" element={<Patients />} />
      </Route>

      {/* Patient Protected Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
      </Route>

      {/* Shared Protected Routes (Accessible by both doctor & patient) */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['doctor', 'patient']}>
            {user?.role === 'doctor' ? <DoctorLayout /> : <PatientLayout />}
          </ProtectedRoute>
        }
      >
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/ai-insights/:appointmentId" element={<AIInsights />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
