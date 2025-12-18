const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext && ext.length <= 10 ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded. Use field name 'image'." });
  res.json({
    uploaded: true,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
});

router.get("/list", (req, res) => {
  const files = fs.readdirSync(uploadDir);
  res.json(files.map((f) => ({ filename: f, url: `/uploads/${f}` })));
});

module.exports = router;
