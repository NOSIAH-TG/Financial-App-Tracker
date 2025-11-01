import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./TrackSection.css";
import {
  FaChartPie,
  FaListAlt,
  FaProjectDiagram,
  FaChartBar,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa";

const TrackSection = () => {
  const [topCategory, setTopCategory] = useState("");
  const [largestExpense, setLargestExpense] = useState(null);
  const [largestIncome, setLargestIncome] = useState(null);
  

  useEffect(() => {
    const fetchTrackData = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount, type, category, note")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching track data:", error);
        return;
      }

      // Top category
      const categoryCount = {};
      data.forEach((t) => {
        if (t.category) {
          categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
        }
      });
      const top = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(top ? top[0] : "N/A");

      // Largest expense
      const expenses = data.filter((t) => t.type === "expense");
      const largestExp = expenses.reduce(
        (max, t) => (t.amount > max.amount ? t : max),
        { amount: 0 }
      );
      setLargestExpense(largestExp);

      // Largest income
      const incomes = data.filter((t) => t.type === "income");
      const largestInc = incomes.reduce(
        (max, t) => (t.amount > max.amount ? t : max),
        { amount: 0 }
      );
      setLargestIncome(largestInc);
    };

    fetchTrackData();
  }, []);

  return (
    <section className="track-section">
      <h3 className="section-title">Spending Insights < FaListAlt /></h3>
      <p className="section-subtitle">Monitor habits and recurring patterns.</p>
      <ul className="track-list">
        <li><strong>Top Category:</strong> {topCategory}</li>
        <li>
          <strong>Largest Expense:</strong>{" "}
          <span className="expense-figure">₣{largestExpense?.amount}</span> — {largestExpense?.category}
        </li>
        <li>
          <strong>Largest Income:</strong>{" "}
          <span className="income-figure">₣{largestIncome?.amount}</span> — {largestIncome?.category}
        </li>
      </ul>
    </section>
  );
};

export default TrackSection;