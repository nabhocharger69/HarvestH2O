import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Page imports
import Home from './pages/Home';
import StudentDashboard from './pages/student-dashboard';
import TeacherDashboard from './pages/teacher-dashboard';
import StudentProfile from './pages/student-profile';
import ClassroomManagement from './pages/classroom-management';
import DeviceConnection from './pages/device-connection';
import PhotoGallery from './pages/photo-gallery';
import QuizPage from './pages/quiz';
import DailyQuiz from './pages/daily-quiz';
import NotFound from './pages/NotFound';
import SensorAnalysis from './pages/sensor-analysis';

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/student-dashboard" replace />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/classroom-management" element={<ClassroomManagement />} />
          <Route path="/device-connection" element={<DeviceConnection />} />
          <Route path="/photo-gallery" element={<PhotoGallery />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/daily-quiz" element={<DailyQuiz />} />
          <Route path="/sensor-analysis" element={<SensorAnalysis />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default AppRoutes;