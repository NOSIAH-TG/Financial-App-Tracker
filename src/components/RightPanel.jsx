import React, { useState } from "react";
import "./RightPanel.css";
import { FaClipboardList, FaCalendarAlt, FaUserCircle, FaTrash, FaGithub } from "react-icons/fa";

const RightPanel = () => {
  const initialTasks = [
    { id: 1, text: "Review October Expenses", done: true },
    { id: 4, text: "Get a new phone", done: true },
    { id: 2, text: "Add new income record", done: false },
    { id: 3, text: "Prepare monthly report", done: false },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newEntry = {
      id: Date.now(),
      text: newTask.trim(),
      done: false,
    };
    setTasks((prev) => [newEntry, ...prev]);
    setNewTask("");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const contributors = [
  {
    id: 1,
    name: "Marvel 🦋",
    role: "UI Designer",
    github: "https://github.com/MarvelMafong",
  },
  {
    id: 2,
    name: "Raven 🧑🏽‍💻",
    role: "Backend",
    github: "https://github.com/Ravennelli",
  },
  {
    id: 3,
    name: "Gilbert 🧑🏽‍💻",
    role: "Backend",
    github: "https://github.com/NOSIAH-TG",
  },
  {
    id: 4,
    name: "Daisy 🦋",
    role: "Dev Ops Engineer",
    github: "https://github.com/daizyleticianyuyubunridzem",
  },
];

  return (
    <aside className="right-panel">
      {/* Tasks Section */}
      <div className="panel-section">
        <h3>
          <FaClipboardList className="icon" /> Projects
        </h3>

        <div className="task-input">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            aria-label="New task input"
          />
          <button onClick={addTask} aria-label="Add task">Add</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  aria-label={`Mark ${task.text} as ${
                    task.done ? "incomplete" : "complete"
                  }`}
                />
                <span>{task.text}</span>
              </label>
              <button
                className="delete-task"
                onClick={() => deleteTask(task.id)}
                aria-label={`Delete ${task.text}`}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="panel-section">
        <h3>
          <FaCalendarAlt className="icon" /> Calendar
        </h3>
        <div className="calendar-box">
          <p className="date">{new Date().toDateString()}</p>
          <p className="highlight">Next due: Oct 25th — Budget Review</p>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="panel-section">
        <h3>
          <FaUserCircle className="icon" /> Top Contributors
        </h3>
        <ul className="contributors">
            {contributors.map((user) => (
            <li key={user.id}>
              <FaUserCircle className="avatar" />
              <div>
                <strong>{user.name}</strong>
                <p>{user.role}</p>
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                    aria-label={`GitHub profile of ${user.name}`}
                  >
                    <FaGithub />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default RightPanel;
