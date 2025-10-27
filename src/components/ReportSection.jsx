import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaChartBar } from "react-icons/fa";
import "./ReportSection.css"

const ReportSection = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    topCategory: "",
  });

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount, type, category, created_at");

      if (error) {
        console.error("Error fetching report:", error);
        return;
      }

      const currentMonth = new Date().getMonth();
      const filtered = data.filter((t) => new Date(t.created_at).getMonth() === currentMonth);

      const income = filtered
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = filtered
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = income - expense;

      const categoryCount = {};
      filtered.forEach((t) => {
        if (t.category) {
          categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
        }
      });
      const top = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

      setSummary({
        income,
        expense,
        balance,
        topCategory: top ? top[0] : "N/A",
      });
    };

    fetchReport();
  }, []);

  return (
    <section className="report-section">
      <h3 className="section-title">Monthly Report <FaChartBar className="icon" /> </h3>
      <p className="section-subtitle">Overview for {new Date().toLocaleString("default", { month: "long" })}</p>
      <ul className="report-list">
        <li><strong>Total Income:</strong> <span>₣{summary.income}</span></li>
        <li><strong>Total Expenses:</strong> <span>₣{summary.expense}</span></li>
        <li><strong>Balance:</strong> <span>₣{summary.balance}</span></li>
        <li><strong>Top Category:</strong> {summary.topCategory}</li>
      </ul>
    </section>
  );
};

export default ReportSection;