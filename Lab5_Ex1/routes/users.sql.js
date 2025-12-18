const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM users ORDER BY user_id");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    const { full_name, address, registration_date, email } = req.body;
    const { rows } = await db.query(
      `INSERT INTO users(full_name, address, registration_date, email)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [full_name, address, registration_date, email]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { full_name, address, registration_date, email } = req.body;

    const { rows } = await db.query(
      `UPDATE users
       SET full_name=$1, address=$2, registration_date=$3, email=$4
       WHERE user_id=$5
       RETURNING *`,
      [full_name, address, registration_date, email, id]
    );

    if (!rows[0]) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await db.query(
      "DELETE FROM users WHERE user_id=$1 RETURNING *",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
