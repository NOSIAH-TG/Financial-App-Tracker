// Raven/Gilbert... please work together File
// Description: Dashboard summary and analytics section for Taskify
// Note: Gilbert will later connect Supabase data (income, expenses, balance). Please work with Gilbert.

import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import "./DashboardAnalytics.css";

const DashboardAnalytics = () => {
  // Local mock data — Gilbert please replace with Supabase query. I would send u the table schem in Supabase.
  const [summary, setSummary] = useState({
    totalIncome: 250000,
    totalExpense: 120000,
    balance: 130000,
  });

  // 🔮 For charts later (Raven and Gilbert. Please work together to come out with this)
  useEffect(() => {
    // Example for Gilbert:
    // const { data, error } = await supabase
    //   .from("transactions")
    //   .select("amount, type")
    //   .eq("user_id", currentUser.id);
  }, []);

  return (
    <section className="dashboard-analytics">
      <h3 className="section-title">Financial Overview</h3>

      <div className="summary-cards">
        <div className="card income">
          <div className="icon-wrapper">
            <FaArrowUp />
          </div>
          <h4>Total Income</h4>
          <p>₣{summary.totalIncome.toLocaleString()}</p>
        </div>

        <div className="card expense">
          <div className="icon-wrapper">
            <FaArrowDown />
          </div>
          <h4>Total Expenses</h4>
          <p>₣{summary.totalExpense.toLocaleString()}</p>
        </div>

        <div className="card balance">
          <div className="icon-wrapper">
            <FaWallet />
          </div>
          <h4>Current Balance</h4>
          <p>₣{summary.balance.toLocaleString()}</p>
        </div>
      </div>

      <div className="chart-section">
        <p style={{ color: "#555" }}>
          Raven’s chart will appear here — showing income vs. expenses trend. replace with the real chart from Gilbert's section and style with the color codes in the css file if necessary.
        </p>
      </div>
    </section>
  );
};

export default DashboardAnalytics;
