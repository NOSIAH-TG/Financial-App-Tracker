import React, { useState, useEffect, useReducer } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AddTransactionSection.css";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const initialFormState = {
  title: "",
  amount: "",
  type: "expense",
  category: "",
  note: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_TRANSACTION":
      return { ...action.payload };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
}

const AddTransactionSection = () => {
  const [transactions, setTransactions] = useState([]);
  const [form, dispatch] = useReducer(formReducer, initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showForm, setShowForm] = useState(true);
  const [visibleCount, setVisibleCount] = useState(5);

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
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleAddOrUpdateTransaction = async (e) => {
    e.preventDefault();

    if (editingId) {
      const { data, error } = await supabase
        .from("transactions")
        .update(form)
        .eq("id", editingId)
        .select()
        .single();

      if (!error && data) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === editingId ? data : t))
        );
        setEditingId(null);
      } else {
        console.error("Error updating transaction:", error);
      }
    } else {
      const { data, error } = await supabase
        .from("transactions")
        .insert([form])
        .select()
        .single();

      if (!error && data) {
        if (
          selectedCategory === "all" ||
          data.category === selectedCategory
        ) {
          setTransactions((prev) => [data, ...prev]);
        }
      } else {
        console.error("Error adding transaction:", error);
      }
    }

    dispatch({ type: "RESET_FORM" });
  };

  const handleEdit = (transaction) => {
    dispatch({ type: "LOAD_TRANSACTION", payload: transaction });
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

      if (!error) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <section className="add-transaction">
      <button
        className="toggle-form-btn"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Hide Form" : "+ Add Transaction"}
      </button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3>{editingId ? "Edit Transaction" : "Add New Transaction"}</h3>
            <form
              onSubmit={handleAddOrUpdateTransaction}
              className="transaction-form"
            >
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
              <select
                type="text"
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
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
          </motion.div>
        )}
      </AnimatePresence>

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
          <>
            <AnimatePresence>
              {transactions.slice(0, visibleCount).map((t) => (
                <motion.div
                  key={t.id}
                  className="transaction-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
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
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {transactions.length > 5 && (
              <motion.button
                key = "toggle-transactions"
                className="toggle-transactions-btn"
                onClick={() =>
                  setVisibleCount((prev) =>
                    prev === 3 ? transactions.length : 3
                  )
                }
                initial={{ opacity:0, y:10 }}
                animate = {{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10}}
                transition={{ duration: 0.4}}
              >
                {visibleCount === 3 ? "Show All" : "Show Less"}
              </motion.button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AddTransactionSection;