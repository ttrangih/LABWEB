const express = require("express");
const router = express.Router();
const db = require("../db");

// Xem cart theo user_id: /carts-sql/user/1
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { rows } = await db.query(
      `SELECT sci.cart_item_id, sci.user_id, sci.product_id, sci.quantity, sci.added_at,
              p.product_name, p.price
       FROM shopping_cart_items sci
       JOIN products p ON p.product_id = sci.product_id
       WHERE sci.user_id = $1
       ORDER BY sci.cart_item_id`,
      [userId]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Add item: body { user_id, product_id, quantity }
router.post("/", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    const { rows } = await db.query(
      `INSERT INTO shopping_cart_items(user_id, product_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = shopping_cart_items.quantity + EXCLUDED.quantity
       RETURNING *`,
      [user_id, product_id, quantity || 1]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Update quantity by cart_item_id
router.put("/:cartItemId", async (req, res) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    const { rows } = await db.query(
      `UPDATE shopping_cart_items
       SET quantity=$1
       WHERE cart_item_id=$2
       RETURNING *`,
      [quantity, cartItemId]
    );

    if (!rows[0]) return res.status(404).json({ message: "Cart item not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Delete item
router.delete("/:cartItemId", async (req, res) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { rows } = await db.query(
      "DELETE FROM shopping_cart_items WHERE cart_item_id=$1 RETURNING *",
      [cartItemId]
    );
    if (!rows[0]) return res.status(404).json({ message: "Cart item not found" });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
