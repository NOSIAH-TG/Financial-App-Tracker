import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./AddProjectForm.css";

const supabaseUrl = "https://sllkrgjvtoktisbgbemi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbGtyZ2p2dG9rdGlzYmdiZW1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTA2MTksImV4cCI6MjA3NjM4NjYxOX0.lq02VBKlGWOnbu3uw7qGJuH-ug4QA07e6HHigQGy--M";

const supabase = createClient(supabaseUrl, supabaseKey);

const AddProjectForm = ({ onProjectAdded }) => {
  const [form, setForm] = useState({
    name: "",
    budget: "",
    spent: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
    setSuccessMsg("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Project name is required.";
    if (Number(form.budget) <= 0) return "Budget must be greater than zero.";
    if (Number(form.spent) < 0) return "Spent amount cannot be negative.";
    if (Number(form.spent) > Number(form.budget))
      return "Spent cannot exceed budget.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("projects").insert([form]);

    if (error) {
      console.error("Error adding project:", error);
      setErrorMsg("Failed to save project. Please try again.");
    } else {
      setForm({ name: "", budget: "", spent: "", note: "" });
      setSuccessMsg("Project saved successfully!");
      if (onProjectAdded) onProjectAdded();
    }

    setLoading(false);
  };

  return (
    <section className="add-project-form">
      <h3 className="section-title">Add New Project</h3>
      <form onSubmit={handleSubmit} className="project-form">
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
          placeholder="Budget (₣)"
          value={form.budget}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="spent"
          placeholder="Spent (₣)"
          value={form.spent}
          onChange={handleChange}
          required
        />
        <textarea
          name="note"
          placeholder="Optional note or caption"
          value={form.note}
          onChange={handleChange}
        ></textarea>

        {errorMsg && <p className="form-error">{errorMsg}</p>}
        {successMsg && <p className="form-success">{successMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Project"}
        </button>
      </form>
    </section>
  );
};

export default AddProjectForm;