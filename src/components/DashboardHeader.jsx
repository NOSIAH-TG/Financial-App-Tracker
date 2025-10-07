// DashboardHeader.jsx
// This displays the top bar of the dashboard. It is static and doesnt need editing.
// It includes a greeting, search bar, notification icon, and user avatar

import React from "react";
import "./DashboardHeader.css";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h2 className="dashboard-greeting">
          Hi, Marvel Mafong 👋
        </h2>
        <p className="dashboard-subtitle">
          Welcome back! Here’s your daily overview.
        </p>
      </div>

      <div className="dashboard-header-right">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>

        <div className="header-icons">
          <FaBell className="notification-icon" />
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
