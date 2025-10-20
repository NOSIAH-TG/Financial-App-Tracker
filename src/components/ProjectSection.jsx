import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "./ProjectSection.css";

const supabaseUrl = "https://sllkrgjvtoktisbgbemi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = createClient(supabaseUrl, supabaseKey);

const AddProjectForm = () => {
  const [form, setForm] = useState({
    name: "",
    budget: "",
    spent: "",
    note: "",
  });
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error("Error fetching projects:", error.message || error);
    } else {
      setProjects(data);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const budget = Number(form.budget);
    const spent = Number(form.spent);

    if (!form.name.trim()) return setErrorMsg("Project name is required.");
    if (isNaN(budget) || budget <= 0) return setErrorMsg("Budget must be a valid number.");
    if (isNaN(spent) || spent < 0) return setErrorMsg("Spent must be a valid number.");

    const payload = {
      name: form.name.trim(),
      budget,
      spent,
      note: form.note.trim(),
    };

    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error("Error updating project:", error.message || error);
        setErrorMsg("Failed to update project.");
      } else {
        setEditingId(null);
        setForm({ name: "", budget: "", spent: "", note: "" });
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from("projects").insert([payload]);
      if (error) {
        console.error("Error adding project:", error.message || error);
        setErrorMsg("Failed to save project.");
      } else {
        setForm({ name: "", budget: "", spent: "", note: "" });
        fetchProjects();
      }
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      name: project.name,
      budget: project.budget,
      spent: project.spent,
      note: project.note || "",
    });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      console.error("Error deleting project:", error.message || error);
      setErrorMsg("Failed to delete project.");
    } else {
      fetchProjects();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", budget: "", spent: "", note: "" });
    setErrorMsg("");
  };

  return (
    <div className="add-project-wrapper">
      <form onSubmit={handleSubmit} className="add-project-form">
        <h4>{editingId ? "Edit Project" : "Add New Project"}</h4>
        <input
          type="text"
          name="name"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="budget"
          placeholder="Budget"
          value={form.budget}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="spent"
          placeholder="Spent"
          value={form.spent}
          onChange={handleChange}
          required
        />
        <textarea
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Save Project"}</button>
        {editingId && <button type="button" onClick={handleCancelEdit}>Cancel</button>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>

      <div className="project-list">
        <h4>Existing Projects</h4>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((p) => {
            const percent = Math.min(100, Math.round((p.spent / p.budget) * 100));
            return (
              <div key={p.id} className="project-card">
                <h5>{p.name}</h5>
                <p>₣{p.spent} spent of ₣{p.budget} budget ({percent}%)</p>
                {p.note && <p className="project-note">{p.note}</p>}
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AddProjectForm;
