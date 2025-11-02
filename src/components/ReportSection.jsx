import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FaChartBar } from "react-icons/fa";
import "./ReportSection.css";

const ReportSection = ({ searchTerm }) => {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    topCategory: "",
  });

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount, type, category, note, created_at");

      if (error) {
        console.error("Error fetching report:", error);
        return;
      }

      const filteredByMonthYear = data.filter((t) => {
        const date = new Date(t.created_at);
        return (
          date.getMonth() === selectedMonth &&
          date.getFullYear() === selectedYear
        );
      });

      const filtered = searchTerm
        ? filteredByMonthYear.filter(
            (t) =>
              t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              t.note?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : filteredByMonthYear;

      if (filtered.length === 0) {
        setHasData(false);
        setSummary({
          income: 0,
          expense: 0,
          balance: 0,
          topCategory: "N/A",
        });
        return;
      }

      setHasData(true);

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
  }, [selectedMonth, selectedYear, searchTerm]);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i);
    return {
      value: i,
      label: date.toLocaleString("default", { month: "long" }),
    };
  });

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year };
  });

  return (
    <section className="report-section">
      <h3 className="section-title">
        Monthly Report <FaChartBar className="icon" />
      </h3>

      <div className="selectors">
        <div className="month-selector">
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="year-selector">
          <label htmlFor="year">Year:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map((y) => (
              <option key={y.value} value={y.value}>
                {y.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="section-subtitle">
        Overview for {monthOptions[selectedMonth].label} {selectedYear}
      </p>

      {!hasData ? (
        <p className="no-data">No data available for this month and year.</p>
      ) : (
        <ul className="report-list">
          <li>
            <strong>Total Income:</strong> <span>₣{summary.income}</span>
          </li>
          <li>
            <strong>Total Expenses:</strong> <span>₣{summary.expense}</span>
          </li>
          <li>
            <strong>Balance:</strong> <span>₣{summary.balance}</span>
          </li>
          <li>
            <strong>Top Category:</strong> {summary.topCategory}
          </li>
        </ul>
      )}
    </section>
  );
};

export default ReportSection;