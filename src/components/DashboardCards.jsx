// Marvel. This is static for display and UI purposes.. please dont edit.
// Description: Displays the summary statistic cards on the dashboard overview.

import React from "react";
import "./DashboardCards.css";
import { FaCheckCircle, FaSpinner, FaClock, FaFolderOpen } from "react-icons/fa";

const DashboardCards = () => {
  return (
    <section className="dashboard-cards">
      {/* ✅ Completed Tasks */}
      <div className="card completed">
        <div className="card-icon">
          <FaCheckCircle />
        </div>
        <div className="card-details">
          <h3>Completed</h3>
          <p>4 Projects</p>
        </div>
      </div>

      {/* 🔄 In Progress */}
      <div className="card progress">
        <div className="card-icon">
          <FaSpinner />
        </div>
        <div className="card-details">
          <h3>In Progress</h3>
          <p>5 Projects</p>
        </div>
      </div>

      {/* ⏳ Pending */}
      <div className="card pending">
        <div className="card-icon">
          <FaClock />
        </div>
        <div className="card-details">
          <h3>Pending</h3>
          <p>* Projects</p>
        </div>
      </div>

      {/* 📁 Projects */}
      <div className="card projects">
        <div className="card-icon">
          <FaFolderOpen />
        </div>
        <div className="card-details">
          <h3>Projects</h3>
          <p>5 Active</p>
        </div>
      </div>
    </section>
  );
};

export default DashboardCards;
