// Section: Raven's section
// Description: Displays the main finance dashboard area showing total balance,
// income vs expenses chart, and recent transactions summary.

import React, { useState, useMemo } from "react";
import "./DashboardMain.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Chart.js Imports
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js Components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Initial (Static) Transaction Data
// Using useMemo and useState will make this dynamic
const INITIAL_TRANSACTIONS = [
    { id: 1, description: "Salary - Tech Solutions", amount: 200000, type: "income", date: '2025-06-01' },
    { id: 2, description: "Groceries", amount: -45000, type: "expense", date: '2025-06-05' },
    { id: 3, description: "Freelance Project Payment", amount: 120000, type: "income", date: '2025-07-10' },
    { id: 4, description: "Transportation", amount: -15000, type: "expense", date: '2025-07-12' },
    { id: 5, description: "Internet/Subscription Fee", amount: -10000, type: "expense", date: '2025-08-01' },
    { id: 6, description: "Commission Bonus", amount: 50000, type: "income", date: '2025-08-15' },
    { id: 7, description: "Dinner Out", amount: -25000, type: "expense", date: '2025-09-02' },
];

// Chart.js Options (unchanged)
const chartOptions = {
    responsive: true, maintainAspectRatio: false, 
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return 'XAF ' + value / 1000 + 'K'; } } }, x: { grid: { display: false } } }
};

const DashboardMain = () => {
    // 1. STATE TO HOLD TRANSACTION DATA
    const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);

    // Helper function to format amount with XAF currency and sign
    const formatCurrency = (amount, type) => {
        const sign = type === 'income' ? '+' : '-';
        const absoluteAmount = Math.abs(amount).toLocaleString('en-US');
        return `${sign}XAF ${absoluteAmount}`;
    };

    // 2. FUNCTION TO PROCESS TRANSACTIONS FOR CHART DATA
    const getChartData = (txns) => {
        const monthlySummary = {};
        
        txns.forEach(txn => {
            // Get the month (e.g., '06' for June) and year (e.g., '2025')
            const monthYear = txn.date.substring(0, 7); // 'YYYY-MM'
            const monthName = new Date(txn.date).toLocaleString('en-US', { month: 'short' });

            if (!monthlySummary[monthYear]) {
                monthlySummary[monthYear] = { name: monthName, income: 0, expenses: 0 };
            }

            if (txn.type === 'income') {
                monthlySummary[monthYear].income += txn.amount;
            } else if (txn.type === 'expense') {
                // Amounts are stored as negative for expenses, so we subtract the negative number (i.e., add the positive equivalent)
                monthlySummary[monthYear].expenses += Math.abs(txn.amount); 
            }
        });

        // Convert the object into an array and sort by monthYear
        const sortedData = Object.keys(monthlySummary)
            .sort()
            .map(key => monthlySummary[key]);
        
        return {
            labels: sortedData.map(data => data.name),
            datasets: [
                { label: 'Income', data: sortedData.map(data => data.income), backgroundColor: 'rgba(40, 167, 69, 0.8)' },
                { label: 'Expenses', data: sortedData.map(data => data.expenses), backgroundColor: 'rgba(220, 53, 69, 0.8)' },
            ],
        };
    };

    // 3. MEMOIZED CHART DATA CALCULATION
    const processedChartData = useMemo(() => getChartData(transactions), [transactions]);

    // 4. DERIVED ACCOUNT BALANCES
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalBalance = totalIncome - totalExpenses;
    
    // 5. EXAMPLE FUNCTION TO ADD A NEW TRANSACTION (for testing conditional display)
    const addTransaction = () => {
        const newTxn = { 
            id: Date.now(), 
            description: "New Test Income", 
            amount: 150000, 
            type: "income", 
            date: new Date().toISOString().substring(0, 10) 
        };
        // This simulates adding a new transaction, which updates the state and re-renders the chart
        setTransactions([...transactions, newTxn]);
    };

    // 6. Conditional Chart Rendering check
    const isChartVisible = transactions.length > 0;


  return (
    <section className="dashboard-main">
      {/* Top Balance Overview */}
      <div className="balance-section">
        <h3 className="section-title">Account Overview</h3>

        <div className="balance-card">
          <h4>Total Balance</h4>
          <h2 className="balance-amount">XAF {totalBalance.toLocaleString('en-US')}</h2>

          <div className="balance-stats">
            <p className="income">
              <FaArrowUp /> Income: <span>XAF {totalIncome.toLocaleString('en-US')}</span>
            </p>
            <p className="expense">
              <FaArrowDown /> Expenses: <span>XAF {totalExpenses.toLocaleString('en-US')}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Income vs Expense Chart (Conditional Display) */}
      <div className="chart-section">
        <h3 className="section-title">Income vs Expenses</h3>
        
        {/* Conditional Chart Rendering based on isChartVisible */}
        {isChartVisible ? (
            <div style={{ width: '100%', height: 300 }}>
                <Bar data={processedChartData} options={chartOptions} />
            </div>
        ) : (
            <div className="chart-placeholder">
                No transactions yet. Add a transaction to see the chart.
                {/* Optional button to test the functionality */}
                <button onClick={addTransaction} style={{ marginTop: '15px', padding: '10px' }}>
                    Add Test Transaction
                </button>
            </div>
        )}
      </div>

      {/* Recent Transactions List (Dynamic Rendering) */}
      <div className="transactions-section">
        <h3 className="section-title">Recent Transactions</h3>
        <div className="transactions-list">
          
            {transactions.slice(0, 5).map((transaction) => ( // Display only the 5 most recent
                <div key={transaction.id} className="transaction-item">
                    <p>{transaction.description}</p>
                    <span className={transaction.type === 'income' ? 'income-text' : 'expense-text'}>
                        {formatCurrency(transaction.amount, transaction.type)}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardMain;