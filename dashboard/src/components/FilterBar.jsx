import React from 'react';

const FilterBar = ({ villages, selectedVillage, onVillageChange, statusFilter, onStatusChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="village-filter" className="filter-label">
          Village
        </label>
        <select
          id="village-filter"
          className="filter-select"
          value={selectedVillage}
          onChange={(e) => onVillageChange(e.target.value)}
        >
          <option value="">All Villages</option>
          {villages.map((village) => (
            <option key={village} value={village}>
              {village}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="status-filter" className="filter-label">
          Status
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All</option>
          <option value="flagged">High Risk</option>
          <option value="normal">Normal</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;