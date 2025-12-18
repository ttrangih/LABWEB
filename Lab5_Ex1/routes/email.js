const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to) return res.status(400).json({ message: "Missing 'to' email" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: subject || "Lab5 Email",
      text: text || "Test email!",
    });

    res.json({ sent: true, messageId: info.messageId, to });
  } catch (e) {
    res.status(500).json({ sent: false, message: e.message });
  }
});

module.exports = router;
