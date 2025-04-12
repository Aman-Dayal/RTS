import { ConfigProvider, theme, Spin } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './hooks/useAuth';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import InterviewsPage from "./pages/InterviewsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import NotificationsPage from './pages/NotificationsPage';
import StatusTracker from './pages/StatusTracker';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f2f5"
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/register" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/interviews" element={<InterviewsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/tracker" element={<StatusTracker />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#6E59F5',
          borderRadius: 6,
          fontFamily: 'Poppins, sans-serif',
        },
      }}
    >
      <AuthProvider>
        <BrowserRouter
          future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true,
          }}>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;