import React from 'react';
import { useNavigate } from 'react-router-dom';

const PatientTable = ({ patients }) => {
  const navigate = useNavigate();

  if (patients.length === 0) {
    return <p className="table-empty">No patients found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="patient-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Village</th>
            <th>Phone</th>
            <th>LMP Date</th>
            <th>Next Visit</th>
            <th>Registered By</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr
              key={patient.id}
              className="table-row-clickable"
              onClick={() => navigate(`/patients/${patient.id}`)}
            >
              <td className="table-name">{patient.name}</td>
              <td>{patient.village}</td>
              <td>{patient.phone_number}</td>
              <td>{patient.lmp_date}</td>
              <td>{patient.visit_1_date}</td>
              <td>{patient.chw_name}</td>
              <td>
                {patient.is_flagged ? (
                  <span className="badge badge-flagged">High Risk</span>
                ) : (
                  <span className="badge badge-normal">Normal</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;