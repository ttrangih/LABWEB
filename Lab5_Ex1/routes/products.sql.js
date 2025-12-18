const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM products ORDER BY product_id");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { product_name, price, manufacturing_date } = req.body;
    const { rows } = await db.query(
      `INSERT INTO products(product_name, price, manufacturing_date)
       VALUES ($1,$2,$3) RETURNING *`,
      [product_name, price, manufacturing_date]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { product_name, price, manufacturing_date } = req.body;

    const { rows } = await db.query(
      `UPDATE products
       SET product_name=$1, price=$2, manufacturing_date=$3
       WHERE product_id=$4
       RETURNING *`,
      [product_name, price, manufacturing_date, id]
    );

    if (!rows[0]) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { rows } = await db.query(
      "DELETE FROM products WHERE product_id=$1 RETURNING *",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
