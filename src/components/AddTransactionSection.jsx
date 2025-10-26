import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AddTransactionSection.css";
import { supabase } from "../supabaseClient";

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
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchTransactions = async (category = "all") => {
    let query = supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching transactions:", error);
    } else {
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedCategory);

    const subscription = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => fetchTransactions(selectedCategory)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedCategory]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateTransaction = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("transactions")
        .update(form)
        .eq("id", editingId);

      if (!error) {
        setEditingId(null);
      } else {
        console.error("Error updating transaction:", error);
      }
    } else {
      const { error } = await supabase.from("transactions").insert([form]);

      if (error) {
        console.error("Error adding transaction:", error);
      }
    }

    setForm({
      title: "",
      amount: "",
      type: "expense",
      category: "",
      note: "",
    });
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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );
    if (confirmDelete) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

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

      {/* ✅ Category Filter Dropdown */}
      <div className="category-filter">
        <label htmlFor="category-select">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All</option>
          <option value="health">Health</option>
          <option value="project">Project</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="salary">Salary</option>
          <option value="freelance">Freelance</option>
          <option value="other">Other</option>
        </select>
      </div>

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