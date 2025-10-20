import React, { useEffect, useState } from "react";
import "./DashboardMain.css";
import TrackSection from "./TrackSection";
import ProjectSection from "./ProjectSection";
import ReportSection from "./ReportSection";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { supabase } from "../supabaseClient";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const DashboardMain = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount, type, title, category, created_at")
      .order("created_at", { ascending: false });

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
    setRecentTransactions(data.slice(0, 4));
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel("dashboard-main")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => fetchData()
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
        backgroundColor: "#130eaf",
      },
      {
        label: "Expense",
        data: expenseValues,
        backgroundColor: "#ff6600",
      },
    ],
  };

  const pieChartConfig = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [summary.totalIncome, summary.totalExpense],
        backgroundColor: ["#130eaf", "#ff6600"],
      },
    ],
  };

  return (
    <div>
    <section className="dashboard-main">
      {/* Top Balance Overview */}
      <div className="balance-section">
        <h3 className="section-title">Account Overview</h3>
        <div className="balance-card">
          <h4>Total Balance</h4>
          <h2 className="balance-amount">
            XAF {summary.balance.toLocaleString()}
          </h2>
          <div className="balance-stats">
            <p className="income">
              <FaArrowUp /> Income:{" "}
              <span>XAF {summary.totalIncome.toLocaleString()}</span>
            </p>
            <p className="expense">
              <FaArrowDown /> Expenses:{" "}
              <span>XAF {summary.totalExpense.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3 className="section-title">Income vs Expenses (Bar)</h3>
        <Bar data={barChartConfig} />
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3 className="section-title">Income vs Expense (Pie)</h3>
        <Pie data={pieChartConfig} />
      </div>

      {/* Recent Transactions List */}
      <div className="transactions-section">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="transactions-list">
          {recentTransactions.length === 0 ? (
            <p>No recent transactions found.</p>
          ) : (
            recentTransactions.map((t, index) => (
              <div key={index} className="transaction-item">
                <p>
                  {t.title} {t.category ? `- ${t.category}` : ""}
                </p>
                <span
                  className={
                    t.type.toLowerCase() === "income"
                      ? "income-text"
                      : "expense-text"
                  }
                >
                  {t.type.toLowerCase() === "income" ? "+" : "-"}XAF{" "}
                  {Number(t.amount).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
      <div>
        <section id="projects" >
          <ProjectSection />
        </section>
        
        <section id="track" >
          <TrackSection />
        </section>

        <section id="reports" >
          <ReportSection />
        </section>
      </div>
    </div>
  );
};

export default DashboardMain;