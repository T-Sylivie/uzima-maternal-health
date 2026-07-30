import React from 'react';

const Sidebar = ({ onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">UZIMA</div>

      <nav className="sidebar-nav">
        <a className="sidebar-link sidebar-link-active" href="#">
          Patients
        </a>
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        Log Out
      </button>
    </aside>
  );
};

export default Sidebar;