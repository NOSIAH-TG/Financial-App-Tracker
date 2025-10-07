// Gilbert's File
// Component: AddTransactionSection.jsx
// Description: Add, edit, and delete transactions with confirmation dialogs. Intergrate the functionality with Supabase later.

import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AddTransactionSection.css";

const AddTransactionSection = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateTransaction = (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing transaction
      setTransactions(
        transactions.map((t) =>
          t.id === editingId ? { ...t, ...form } : t
        )
      );
      setEditingId(null);
    } else {
      // Add new transaction
      setTransactions([...transactions, { id: Date.now(), ...form }]);
    }

    // Reset form
    setForm({ title: "", amount: "", type: "expense", category: "", note: "" });
  };

  const handleEdit = (transaction) => {
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      note: transaction.note,
    });
    setEditingId(transaction.id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  useEffect(() => {}, []);

  return (
    <section className="add-transaction">
      <h3>{editingId ? "Edit Transaction" : "Add New Transaction"}</h3>
      <form onSubmit={handleAddOrUpdateTransaction} className="transaction-form">
        <input
          type="text"
          name="title"
          placeholder="Transaction Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <textarea
          name="note"
          placeholder="Short Note (optional)"
          value={form.note}
          onChange={handleChange}
        ></textarea>
        <button type="submit">
          {editingId ? "Update Transaction" : "Save Transaction"}
        </button>
      </form>

      <div className="transaction-list">
        <h4>Recent Transactions</h4>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="transaction-card">
              <div>
                <strong>{t.title}</strong> <span>({t.category})</span>
                <p>{t.note}</p>
              </div>
              <div className={`amount ${t.type}`}>
                {t.type === "expense" ? "-" : "+"}₣{t.amount}
              </div>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(t)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AddTransactionSection;
