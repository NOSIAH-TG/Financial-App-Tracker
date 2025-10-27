import React, { useState } from "react";
import "./DashboardHeader.css";
import { FaBell } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const DashboardHeader = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h2 className="dashboard-greeting">Hi, Marvel👋</h2>
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="header-icons">
          <FaBell className="notification-icon" />
          <img
            src="https://picsum.photos/400/300"
            alt="Random Placeholder Image"
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
