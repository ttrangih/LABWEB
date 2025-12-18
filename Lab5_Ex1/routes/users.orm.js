const express = require("express");
const router = express.Router();
const sequelize = require("../models/index");
const User = require("../models/User");

// đảm bảo connect DB
router.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, message: e.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({ order: [["user_id", "ASC"]] });
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [count] = await User.update(req.body, { where: { user_id: id } });
    if (count === 0) return res.status(404).json({ message: "User not found" });
    const user = await User.findByPk(id);
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const count = await User.destroy({ where: { user_id: id } });
    if (count === 0) return res.status(404).json({ message: "User not found" });
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
