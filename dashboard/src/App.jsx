import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NurseDashboardPage from './pages/NurseDashboardPage';
import PatientDetailPage from './pages/PatientDetailPage';
import DistrictReportsPage from './pages/DistrictReportsPage';
import CreateUserPage from './pages/CreateUserPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<NurseDashboardPage />} />
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/district-report" element={<DistrictReportsPage />} />
        <Route path="/admin/create-user" element={<CreateUserPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;