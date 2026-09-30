const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: "db",
  port: 5432,
  database: "tasks_db",
  user: "postgres",
  password: "postgres",
});

// GET toutes les tâches
app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET une tâche
app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST créer une tâche
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const result = await pool.query(
      `INSERT INTO tasks (title, description, completed)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description || null, completed || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT modifier une tâche
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, completed = $3
       WHERE id = $4
       RETURNING *`,
      [title, description || null, completed || false, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE supprimer une tâche
app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tâche introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(3000, () => {
  console.log("API démarrée sur le port 3000");
});
