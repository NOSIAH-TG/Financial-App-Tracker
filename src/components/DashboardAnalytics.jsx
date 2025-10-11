import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { supabase } from "../supabaseClient";
import "./DashboardAnalytics.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardAnalytics = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [chartData, setChartData] = useState([]);

  const fetchSummaryAndChart = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type, created_at");

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    const totalIncome = data
      .filter((t) => t.type.toLowerCase() === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = data
      .filter((t) => t.type.toLowerCase() === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = totalIncome - totalExpense;

    setSummary({ totalIncome, totalExpense, balance });

    const grouped = {};
    data.forEach((t) => {
      const month = new Date(t.created_at).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!grouped[month]) {
        grouped[month] = { income: 0, expense: 0 };
      }

      if (t.type.toLowerCase() === "income") {
        grouped[month].income += Number(t.amount);
      } else {
        grouped[month].expense += Number(t.amount);
      }
    });

    const formattedChartData = Object.entries(grouped).map(
      ([month, values]) => ({
        month,
        income: values.income,
        expense: values.expense,
      })
    );

    setChartData(formattedChartData);
  };

  useEffect(() => {
    fetchSummaryAndChart();

    const subscription = supabase
      .channel("dashboard-analytics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchSummaryAndChart()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const labels = chartData.map((d) => d.month);
  const incomeValues = chartData.map((d) => d.income);
  const expenseValues = chartData.map((d) => d.expense);

  const barChartConfig = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeValues,
        backgroundColor: "#4CAF50",
      },
      {
        label: "Expense",
        data: expenseValues,
        backgroundColor: "#F44336",
      },
    ],
  };

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
        <Bar data={barChartConfig} />
      </div>
    </section>
  );
};

export default DashboardAnalytics;