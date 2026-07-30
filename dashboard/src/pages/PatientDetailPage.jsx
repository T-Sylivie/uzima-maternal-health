import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { logout } from '../services/authService';
import Sidebar from '../components/Sidebar';

const PatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const patientsResponse = await apiClient.get('/api/patients/nurse/');
        const found = patientsResponse.data.find((p) => p.id === Number(id));
        setPatient(found);

        const notesResponse = await apiClient.get(`/api/visits/notes/?patient=${id}`);
        setNotes(notesResponse.data);
      } catch (err) {
        setError('Failed to load patient details.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    try {
      const response = await apiClient.post('/api/visits/notes/', {
        patient: Number(id),
        text: newNote,
      });
      setNotes([response.data, ...notes]);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar onLogout={handleLogout} />
        <main className="dashboard-main">
          <p className="dashboard-status">Loading...</p>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="dashboard-layout">
        <Sidebar onLogout={handleLogout} />
        <main className="dashboard-main">
          <p className="dashboard-status dashboard-error">Patient not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <main className="dashboard-main">
        <button className="back-link" onClick={() => navigate('/dashboard')}>
          ← Back to Patients
        </button>

        <header className="dashboard-header">
          <h1>{patient.name}</h1>
          {patient.is_flagged ? (
            <span className="badge badge-flagged">High Risk</span>
          ) : (
            <span className="badge badge-normal">Normal</span>
          )}
        </header>

        {error && <p className="dashboard-status dashboard-error">{error}</p>}

        <div className="detail-grid">
          <section className="detail-card">
            <h3>Patient Information</h3>
            <div className="panel-row"><span>Village</span><span>{patient.village}</span></div>
            <div className="panel-row"><span>Phone</span><span>{patient.phone_number}</span></div>
            <div className="panel-row"><span>LMP Date</span><span>{patient.lmp_date}</span></div>
            <div className="panel-row"><span>Registered By</span><span>{patient.chw_name}</span></div>
          </section>

          <section className="detail-card">
            <h3>ANC Visit Schedule</h3>
            <div className="panel-row"><span>Visit 1</span><span>{patient.visit_1_date}</span></div>
            <div className="panel-row"><span>Visit 2</span><span>{patient.visit_2_date}</span></div>
            <div className="panel-row"><span>Visit 3</span><span>{patient.visit_3_date}</span></div>
            <div className="panel-row"><span>Visit 4</span><span>{patient.visit_4_date}</span></div>
          </section>
        </div>

        <section className="detail-card">
          <h3>Notes</h3>

          <div className="note-input-group">
            <textarea
              className="note-textarea"
              placeholder="Add a note about this patient..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button className="note-submit" onClick={handleAddNote} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Note'}
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="panel-status">No notes yet.</p>
          ) : (
            <ul className="note-list">
              {notes.map((note) => (
                <li key={note.id} className="note-item">
                  <p>{note.text}</p>
                  <span className="note-meta">
                    {note.nurse_name} • {new Date(note.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDetailPage;