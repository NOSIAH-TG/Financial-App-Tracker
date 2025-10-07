// Section: Raven's section
// Description: Displays the main finance dashboard area showing total balance,
// income vs expenses chart, and recent transactions summary.

import React from "react";
import "./DashboardMain.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const DashboardMain = () => {
  return (
    <section className="dashboard-main">
      {/* Top Balance Overview */}
      <div className="balance-section">
        <h3 className="section-title">Account Overview</h3>

        <div className="balance-card">
          <h4>Total Balance</h4>
          <h2 className="balance-amount">XAF 1,245,000</h2>

          <div className="balance-stats">
            <p className="income">
              <FaArrowUp /> Income: <span>XAF 870,000</span>
            </p>
            <p className="expense">
              <FaArrowDown /> Expenses: <span>XAF 375,000</span>
            </p>
          </div>
        </div>
      </div>

      {/*  Income vs Expense Chart (Placeholder for Raven) */}
      <div className="chart-section">
        <h3 className="section-title">Income vs Expenses</h3>
        <div className="chart-placeholder">
          📊 Chart Placeholder
        </div>
        {/* TODO: Raven will integrate an actual chart here using Recharts or Chart.js */}
      </div>

      {/* Recent Transactions List */}
      <div className="transactions-section">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="transactions-list">
          <div className="transaction-item">
            <p>Salary - Company Ltd</p>
            <span className="income-text">+XAF 200,000</span>
          </div>
          <div className="transaction-item">
            <p>Groceries</p>
            <span className="expense-text">-XAF 45,000</span>
          </div>
          <div className="transaction-item">
            <p>Freelance Project</p>
            <span className="income-text">+XAF 120,000</span>
          </div>
          <div className="transaction-item">
            <p>Transportation</p>
            <span className="expense-text">-XAF 15,000</span>
          </div>
        </div>

        {/* TODO: Raven will later fetch real transaction data from state or backend */}
      </div>
    </section>
  );
};

export default DashboardMain;
