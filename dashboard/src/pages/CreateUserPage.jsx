import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { logout } from '../services/authService';
import Sidebar from '../components/Sidebar';

const CreateUserPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CHW');
  const [villageCell, setVillageCell] = useState('');
  const [catchmentArea, setCatchmentArea] = useState('');
  const [healthCentreId, setHealthCentreId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { username, password, role };
      if (role === 'CHW') {
        payload.village_cell = villageCell;
        payload.health_centre_id = healthCentreId;
      } else if (role === 'NURSE') {
        payload.catchment_area = catchmentArea;
        payload.health_centre_id = healthCentreId;
      } else if (role === 'DISTRICT_OFFICER') {
        payload.district_id = districtId;
      }

      await apiClient.post('/api/users/create/', payload);
      setSuccess(`Account "${username}" created successfully.`);
      setUsername('');
      setPassword('');
      setVillageCell('');
      setCatchmentArea('');
      setHealthCentreId('');
      setDistrictId('');
    } catch (err) {
      setError('Failed to create account. Please check the details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Create User Account</h1>
        </header>
        <p className="dashboard-subtitle">
          Register a new CHW, Nurse, or District Officer account
        </p>

        {error && <p className="dashboard-status dashboard-error">{error}</p>}
        {success && <p className="dashboard-status form-success">{success}</p>}

        <form className="detail-card create-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="filter-select">
              <option value="CHW">Community Health Worker</option>
              <option value="NURSE">Nurse</option>
              <option value="DISTRICT_OFFICER">District Health Officer</option>
            </select>
          </div>

          {role === 'CHW' && (
            <>
              <div className="form-group">
                <label>Village Cell</label>
                <input value={villageCell} onChange={(e) => setVillageCell(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Health Centre ID</label>
                <input value={healthCentreId} onChange={(e) => setHealthCentreId(e.target.value)} />
              </div>
            </>
          )}

          {role === 'NURSE' && (
            <>
              <div className="form-group">
                <label>Catchment Area</label>
                <input value={catchmentArea} onChange={(e) => setCatchmentArea(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Health Centre ID</label>
                <input value={healthCentreId} onChange={(e) => setHealthCentreId(e.target.value)} />
              </div>
            </>
          )}

          {role === 'DISTRICT_OFFICER' && (
            <div className="form-group">
              <label>District ID</label>
              <input value={districtId} onChange={(e) => setDistrictId(e.target.value)} />
            </div>
          )}

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateUserPage;