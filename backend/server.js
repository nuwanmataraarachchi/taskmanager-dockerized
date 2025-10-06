require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// GET /api/tasks?page=1&sort=newest
app.get("/api/tasks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || "newest";
    const TASKS_PER_PAGE = 5;

    let orderBy = "created_at DESC";
    if (sort === "oldest") orderBy = "created_at ASC";
    else if (sort === "title") orderBy = "title ASC";

    const offset = (page - 1) * TASKS_PER_PAGE;

    const { rows } = await pool.query(
      `SELECT * FROM task WHERE completed = FALSE ORDER BY ${orderBy} LIMIT $1 OFFSET $2`,
      [TASKS_PER_PAGE, offset]
    );

    // get total count for pagination
    const countResult = await pool.query(
      "SELECT COUNT(*) FROM task WHERE completed = FALSE"
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      tasks: rows,
      page,
      totalPages: Math.ceil(total / TASKS_PER_PAGE),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO task (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/tasks/:id/done
app.post("/api/tasks/:id/done", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "UPDATE task SET completed = TRUE WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
