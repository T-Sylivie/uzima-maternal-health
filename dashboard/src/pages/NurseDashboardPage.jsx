import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { logout } from '../services/authService';
import Sidebar from '../components/Sidebar';
import PatientTable from '../components/PatientTable';
import FilterBar from '../components/FilterBar';

const NurseDashboardPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [villageFilter, setVillageFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await apiClient.get('/api/patients/nurse/');
        setPatients(response.data);
      } catch (err) {
        setError('Failed to load patients.');
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredPatients = patients
    .filter((p) => !villageFilter || p.village === villageFilter)
    .filter((p) => {
      if (statusFilter === 'flagged') return p.is_flagged;
      if (statusFilter === 'normal') return !p.is_flagged;
      return true;
    });

  const villages = [...new Set(patients.map((p) => p.village))];

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Patients</h1>
          <p className="dashboard-subtitle">
            {filteredPatients.length} {filteredPatients.length === 1 ? 'patient' : 'patients'} in your catchment area
          </p>
        </header>

        <FilterBar
          villages={villages}
          selectedVillage={villageFilter}
          onVillageChange={setVillageFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {loading && <p className="dashboard-status">Loading...</p>}
        {error && <p className="dashboard-status dashboard-error">{error}</p>}
        {!loading && !error && <PatientTable patients={filteredPatients} />}
      </main>
    </div>
  );
};

export default NurseDashboardPage;