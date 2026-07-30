import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { logout } from '../services/authService';
import Sidebar from '../components/Sidebar';

const DistrictReportsPage = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await apiClient.get('/api/patients/district-report/');
        setReport(response.data);
      } catch (err) {
        setError('Failed to load report.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownloadCsv = () => {
    const headers = ['Village', 'Total Patients', 'High Risk Cases'];
    const rows = report.map((row) => [row.village, row.total_patients, row.flagged_count]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uzima-district-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalPatients = report.reduce((sum, row) => sum + row.total_patients, 0);
  const totalFlagged = report.reduce((sum, row) => sum + row.flagged_count, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <div className="header-row">
          <div>
            <header className="dashboard-header">
              <h1>District Report</h1>
            </header>
            <p className="dashboard-subtitle">
              Attendance and risk summary across all villages
            </p>
          </div>
          {!loading && !error && report.length > 0 && (
            <button className="export-button" onClick={handleDownloadCsv}>
              Export CSV
            </button>
          )}
        </div>

        {loading && <p className="dashboard-status">Loading...</p>}
        {error && <p className="dashboard-status dashboard-error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="summary-cards">
              <div className="summary-card">
                <span className="summary-value">{totalPatients}</span>
                <span className="summary-label">Total Patients</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">{totalFlagged}</span>
                <span className="summary-label">High Risk Cases</span>
              </div>
              <div className="summary-card">
                <span className="summary-value">{report.length}</span>
                <span className="summary-label">Villages Covered</span>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="patient-table">
                <thead>
                  <tr>
                    <th>Village</th>
                    <th>Total Patients</th>
                    <th>High Risk Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row) => (
                    <tr key={row.village}>
                      <td className="table-name">{row.village}</td>
                      <td>{row.total_patients}</td>
                      <td>
                        {row.flagged_count > 0 ? (
                          <span className="badge badge-flagged">{row.flagged_count}</span>
                        ) : (
                          <span className="badge badge-normal">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DistrictReportsPage;