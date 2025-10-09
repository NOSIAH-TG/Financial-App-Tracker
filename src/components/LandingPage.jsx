import React from "react";
import { FaChartLine, FaWallet, FaUsers } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Taskify</h1>
        <button className="get-started-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </header>

      <section className="landing-hero">
        <h2>The Best Finance Tracking App</h2>
        <p>
          Taskify helps you organize your finances, track spending, and stay in
          control of your goals. All in one clean, simple dashboard.
        </p>

        <div className="feature-cards">
          <div className="card">
            <FaChartLine className="icon" />
            <h3>Track Your Progress</h3>
            <p>Visualize every transaction and goal in style.</p>
          </div>
          <div className="card">
            <FaWallet className="icon" />
            <h3>Smart Budgeting</h3>
            <p>Plan better, spend wiser, and save more effortlessly.</p>
          </div>
          <div className="card">
            <FaUsers className="icon" />
            <h3>Team Collaboration</h3>
            <p>Work with your batchmates on shared financial goals.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Made with Love💜 by Raven, Tasha, Gilbert, Marvel</p>
      </footer>
    </div>
  );
};

export default LandingPage;
