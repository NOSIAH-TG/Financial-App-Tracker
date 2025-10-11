// Section: Right Panel — Tasks, Calendar & Top Contributors
// Description: Displays the right-side dashboard panel with scrollable content. This is static and does not require editing.

import React from "react";
import "./RightPanel.css";
import { FaClipboardList, FaCalendarAlt, FaUserCircle } from "react-icons/fa";

const RightPanel = () => {
  const tasks = [
    { id: 1, text: "Review October Expenses", done: true },
    { id: 2, text: "Add new income record", done: false },
    { id: 3, text: "Prepare monthly report", done: false },
  ];

  const contributors = [
    { id: 1, name: "Marvel 🦋", role: "UI Designer" },
    { id: 2, name: "Raven ", role: "Backend" },
    { id: 3, name: "Gilbert 🧑🏽‍💻", role: "Backend" },
    { id: 4, name: "Daisy", role: "Dev Ops" },
  ];

  return (
    <aside className="right-panel">
      {/* Tasks Section */}
      <div className="panel-section">
        <h3>
          <FaClipboardList className="icon" /> Tasks
        </h3>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <input type="checkbox" checked={task.done} readOnly />
              <span>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="panel-section">
        <h3>
          <FaCalendarAlt className="icon" /> Calendar
        </h3>
        <div className="calendar-box">
          <p className="date">{new Date().toDateString()}</p>
          <p className="highlight">Next due: Oct 25th — Budget Review</p>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="panel-section">
        <h3>
          <FaUserCircle className="icon" /> Top Contributors
        </h3>
        <ul className="contributors">
          {contributors.map((user) => (
            <li key={user.id}>
              <FaUserCircle className="avatar" />
              <div>
                <strong>{user.name}</strong>
                <p>{user.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RightPanel;
