import React, { useState } from "react";
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
  const [activeLink, setActiveLink] = useState("dashboard");

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

      <div className="navWrapper">
        <nav className="navLinks">
          <a
            href="#dashboard"
            className={`link ${activeLink === "dashboard" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveLink("dashboard");
              window.location.reload();
            }}
          >
            <FaChartPie className="icon" />
            <span>Dashboard</span>
          </a>
          <a
            href="#track"
            className={`link ${activeLink === "track" ? "active" : ""}`}
            onClick={() => setActiveLink("track")}
          >
            <FaListAlt className="icon" />
            <span>Track</span>
          </a>
          <a
            href="#projects"
            className={`link ${activeLink === "projects" ? "active" : ""}`}
            onClick={() => setActiveLink("projects")}
          >
            <FaProjectDiagram className="icon" />
            <span>Projects</span>
            
          </a>
          <a
            href="#reports"
            className={`link ${activeLink === "reports" ? "active" : ""}`}
            onClick={() => setActiveLink("reports")}
          >
            <FaChartBar className="icon" />
            <span>Reports</span>
          </a>
        </nav>
      </div>

      <div className="bottomSection">
        <button className="link" onClick={handleLogout}>
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </button>
        <button className="link" onClick={() => window.location.href = "/404"}>
          <FaCog className="icon" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
