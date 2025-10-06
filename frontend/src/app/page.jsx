"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState(1);
  const [removingTaskId, setRemovingTaskId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);

  const TASKS_PER_PAGE = 5;

  // Fetch tasks from backend
  const fetchTasks = async (page = 1, sort = "newest") => {
    try {
      const res = await fetch(`${API_URL}/api/tasks?page=${page}&sort=${sort}`);
      const data = await res.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks(page, sortBy);
  }, [page, sortBy]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description: desc }),
      });
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDesc("");
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark task as done
  const handleDone = async (id) => {
    setRemovingTaskId(id);
    try {
      await fetch(`${API_URL}/api/tasks/${id}/done`, { method: "POST" });
      setTimeout(() => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        setRemovingTaskId(null);
      }, 300);
    } catch (err) {
      console.error(err);
      setRemovingTaskId(null);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h1 style={{ textAlign: "center" }}>📝 Task Manager</h1>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ background: "#fff", padding: "1rem", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "1rem" }}>
        <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "0.5rem", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        <textarea placeholder="Task description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "0.5rem", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        <button type="submit" style={{ padding: "8px 16px", border: "none", borderRadius: "4px", background: "#0070f3", color: "white", cursor: "pointer" }}>Add Task</button>
      </form>

      {/* Sorting Dropdown */}
      {tasks.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ marginRight: "0.5rem" }}>Sort by:</label>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} style={{ padding: "4px 8px", borderRadius: "4px" }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? <p>No tasks available</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ background: "white", marginBottom: "0.5rem", padding: "0.75rem", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s ease", opacity: removingTaskId === task.id ? 0 : 1, transform: removingTaskId === task.id ? "translateX(50px)" : "translateX(0)" }}>
              <div>
                <strong>{task.title}</strong>
                <p style={{ margin: "0.25rem 0 0" }}>{task.description}</p>
              </div>
              <button onClick={() => handleDone(task.id)} style={{ padding: "4px 10px", background: "green", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Done</button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} style={{ padding: "6px 12px", marginRight: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", cursor: page === 1 ? "not-allowed" : "pointer", background: page === 1 ? "#eee" : "#fff" }}>Prev</button>
          <span style={{ alignSelf: "center" }}>Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages} style={{ padding: "6px 12px", marginLeft: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", cursor: page === totalPages ? "not-allowed" : "pointer", background: page === totalPages ? "#eee" : "#fff" }}>Next</button>
        </div>
      )}
    </div>
  );
}
