import React, { useState, useEffect, useReducer } from "react";
import { FaTrash, FaEdit, FaProjectDiagram } from "react-icons/fa";
import "./AddProjectSection.css";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const initialFormState = {
  title: "",
  amount: "",
  type: "expense",
  category: "project",
  note: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_PROJECT":
      return { ...action.payload, category: "project" };
    case "RESET_FORM":
      return initialFormState;
    default:
      return state;
  }
}

const AddProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [form, dispatch] = useReducer(formReducer, initialFormState);
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
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
  };

  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();
    const payload = { ...form, category: "project" };

    if (editingId) {
      const { data, error } = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();

      if (!error && data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingId ? data : p))
        );
        setEditingId(null);
      } else {
        console.error("Error updating project:", error);
      }
    } else {
      const { data, error } = await supabase
        .from("transactions")
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        setProjects((prev) => [data, ...prev]);
      } else {
        console.error("Error adding project:", error);
      }
    }

    dispatch({ type: "RESET_FORM" });
  };

  const handleEdit = (project) => {
    dispatch({ type: "LOAD_PROJECT", payload: project });
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

      if (!error) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <section className="project-section">
  <button className="project-toggle-btn" onClick={() => setShowForm(!showForm)}>
    {showForm ? "Hide Form" : "+ Add Project"}
  </button>

  <AnimatePresence>
    {showForm && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="project-form-wrapper"
      >
        <h3 className="project-form-title">
          {editingId ? "Edit Project" : "Add New Project"}{" "}
          <FaProjectDiagram className="project-icon" />
        </h3>
        <form onSubmit={handleAddOrUpdateProject} className="project-form">
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
          <button type="submit" className="project-save-btn">
            {editingId ? "Update Project" : "Save Project"}
          </button>
        </form>
      </motion.div>
    )}
  </AnimatePresence>

  <div className="project-list">
    <h4 className="project-list-title">Recent Projects</h4>
    {projects.length === 0 ? (
      <p className="project-empty">No projects yet.</p>
    ) : (
      <AnimatePresence>
        {projects.map((p) => (
          <motion.div
            key={p.id}
            className="project-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="project-info">
              <h4>{p.title}</h4>
              <p className="project-category">({p.category})</p>
              <p>{p.note}</p>
            </div>
            <div className={`project-amount ${p.type}`}>
              {p.type === "expense" ? "-" : "+"}₣{p.amount}
            </div>
            <div className="project-actions">
              <button className="project-edit-btn" onClick={() => handleEdit(p)}>
                <FaEdit />
              </button>
              <button
                className="project-delete-btn"
                onClick={() => handleDelete(p.id)}
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    )}
  </div>
</section>
  );
};

export default AddProjectSection;