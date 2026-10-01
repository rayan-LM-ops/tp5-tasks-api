const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const Joi = require("joi");

const app = express();

const corsOrigin =
  process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
  })
);

app.use(express.json());

const pool = new Pool({
  host: "db",
  port: 5432,
  database: "tasks_db",
  user: "postgres",
  password: "postgres",
});

// =========================
// Schéma création tâche
// =========================

const createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(255)
    .required(),

  description: Joi.string()
    .trim()
    .allow("", null)
    .optional(),

  completed: Joi.boolean()
    .optional()
    .default(false),

  // Uniquement le prénom du bénévole
  assignee: Joi.string()
    .trim()
    .max(50)
    .allow("", null)
    .optional(),
});

// =========================
// Schéma modification tâche
// =========================

const updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .max(255)
    .required(),

  description: Joi.string()
    .trim()
    .allow("", null)
    .optional(),

  completed: Joi.boolean()
    .required(),

  // Uniquement le prénom du bénévole
  assignee: Joi.string()
    .trim()
    .max(50)
    .allow("", null)
    .optional(),
});

// =========================
// GET toutes les tâches
// =========================

app.get("/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        completed,
        created_at,
        assignee
       FROM tasks
       ORDER BY id`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =========================
// GET une tâche
// =========================

app.get("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        description,
        completed,
        created_at,
        assignee
       FROM tasks
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Tâche introuvable",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =========================
// POST créer une tâche
// =========================

app.post("/tasks", async (req, res) => {
  try {
    const { error, value } =
      createTaskSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    const {
      title,
      description,
      completed,
      assignee,
    } = value;

    const result = await pool.query(
      `INSERT INTO tasks
       (title, description, completed, assignee)
       VALUES ($1, $2, $3, $4)
       RETURNING
        id,
        title,
        description,
        completed,
        created_at,
        assignee`,
      [
        title,
        description || null,
        completed,
        assignee || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =========================
// PUT modifier une tâche
// =========================

app.put("/tasks/:id", async (req, res) => {
  try {
    const { error, value } =
      updateTaskSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      return res.status(400).json({
        error: "Données invalides",
        details: error.details.map(
          (detail) => detail.message
        ),
      });
    }

    const {
      title,
      description,
      completed,
      assignee,
    } = value;

    const result = await pool.query(
      `UPDATE tasks
       SET
        title = $1,
        description = $2,
        completed = $3,
        assignee = $4
       WHERE id = $5
       RETURNING
        id,
        title,
        description,
        completed,
        created_at,
        assignee`,
      [
        title,
        description || null,
        completed,
        assignee || null,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Tâche introuvable",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =========================
// DELETE supprimer une tâche
// =========================

app.delete("/tasks/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM tasks
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Tâche introuvable",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
});

// =========================
// PATCH état complété
// =========================

app.patch(
  "/tasks/:id/completed",
  async (req, res) => {
    try {
      const completedSchema = Joi.object({
        completed: Joi.boolean().required(),
      });

      const { error, value } =
        completedSchema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });

      if (error) {
        return res.status(400).json({
          error: "Données invalides",
          details: error.details.map(
            (detail) => detail.message
          ),
        });
      }

      const result = await pool.query(
        `UPDATE tasks
         SET completed = $1
         WHERE id = $2
         RETURNING
          id,
          title,
          description,
          completed,
          created_at,
          assignee`,
        [value.completed, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Tâche introuvable",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Erreur serveur",
      });
    }
  }
);

// =========================
// PATCH retirer le bénévole
// =========================

app.patch(
  "/tasks/:id/assignee",
  async (req, res) => {
    try {
      const result = await pool.query(
        `UPDATE tasks
         SET assignee = NULL
         WHERE id = $1
         RETURNING
          id,
          title,
          description,
          completed,
          created_at,
          assignee`,
        [req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Tâche introuvable",
        });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Erreur serveur",
      });
    }
  }
);

// =========================
// Démarrage API
// =========================

app.listen(3000, () => {
  console.log(
    "API disponible sur http://localhost:3000"
  );

  console.log(
    `CORS autorisé pour : ${corsOrigin}`
  );
});
