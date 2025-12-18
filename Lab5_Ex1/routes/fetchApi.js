const express = require("express");
const axios = require("axios");
const router = express.Router();

const db = require("../db"); // dùng raw SQL để lưu

// GET /fetch-api/users
router.get("/users", async (req, res) => {
  try {
    const { data } = await axios.get("https://jsonplaceholder.typicode.com/users");

    const mapped = data.map((u) => ({
      full_name: u.name,
      address: `${u.address.street}, ${u.address.suite}, ${u.address.city}`,
      registration_date: new Date().toISOString().slice(0, 10),
      email: u.email,
    }));

    const inserted = [];
    for (const u of mapped) {
      const { rows } = await db.query(
        `INSERT INTO users(full_name, address, registration_date, email)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (email) DO UPDATE
         SET full_name = EXCLUDED.full_name,
             address = EXCLUDED.address
         RETURNING *`,
        [u.full_name, u.address, u.registration_date, u.email]
      );
      inserted.push(rows[0]);
    }

    res.json({ saved: inserted.length, users: inserted });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
