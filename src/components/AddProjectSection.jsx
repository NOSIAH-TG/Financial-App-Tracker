import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./AddProjectSection.css";
import {   FaProjectDiagram } from "react-icons/fa";
import { supabase } from "../supabaseClient";

const AddProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "project",
    note: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("category", "project")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchProjects();

    const subscription = supabase
      .channel("transactions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        () => fetchProjects()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();

    const payload = { ...form, category: "project" };

    if (editingId) {
      const { error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingId);

      if (!error) {
        setEditingId(null);
      } else {
        console.error("Error updating project:", error);
      }
    } else {
      const { error } = await supabase.from("transactions").insert([payload]);

      if (error) {
        console.error("Error adding project:", error);
      }
    }

    setForm({
      title: "",
      amount: "",
      type: "expense",
      category: "project",
      note: "",
    });
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      amount: project.amount,
      type: project.type,
      category: "project",
      note: project.note,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <section className="add-transaction">
      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "+ Add Project"}
      </button>

      {showForm && (
        <>
          <h3>{editingId ? "Edit Project" : "Add New Project"} <FaProjectDiagram className="icon" /> </h3>
          <form onSubmit={handleAddOrUpdateProject} className="form-container">
            <input
              type="text"
              name="title"
              placeholder="Project Title"
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
            </select>
            <textarea
              name="note"
              placeholder="Short Note (optional)"
              value={form.note}
              onChange={handleChange}
            ></textarea>
            <button type="submit" className="save-btn">
              {editingId ? "Update Project" : "Save Project"}
            </button>
          </form>
        </>
      )}

      <div className="transaction-list">
        <h4>Recent Projects</h4>
        {projects.length === 0 ? (
          <p className="empty">No projects yet.</p>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="transaction-card">
              <div className="info">
                <h4>{p.title}</h4>
                <p className="category">({p.category})</p>
                <p>{p.note}</p>
              </div>
              <div className={`amount ${p.type}`}>
                {p.type === "expense" ? "-" : "+"}₣{p.amount}
              </div>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
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

export default AddProjectSection;