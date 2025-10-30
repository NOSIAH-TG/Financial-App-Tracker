// Marvel's section. please dont edit this
// Section: Sidebar Navigation with Logout.
// Description: Sidebar navigation for Taskify (with working logout)

import React from "react";
import "./Sidebar.css";
import {
  FaChartPie,
  FaListAlt,
  FaProjectDiagram,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";
import { supabase } from "../supabaseClient";

const Sidebar = ({ onLogout }) => {
  // Handle Logout
  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  return (
    <aside className="sidebar">
      <div className="logoSection">
        <h2 className="logo">BugetWise</h2>
      </div>

      <nav className="navLinks">
        <a href="#dashboard" className="link active">
          <FaChartPie className="icon" />
          <span>Dashboard</span>
        </a>
        <a href="#track" className="link">
          <FaListAlt className="icon" />
          <span>Track</span>
        </a>
        <a href="#projects" className="link">
          <FaProjectDiagram className="icon" />
          <span>Projects</span>
          <span className="badge">2</span>
        </a>
        <a href="#reports" className="link">
          <FaChartBar className="icon" />
          <span>Reports</span>
        </a>
      </nav>

      <div className="bottomSection">
        <button className="link" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </button>
        <button className="link">
          <FaCog className="icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
