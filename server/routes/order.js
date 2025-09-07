const express = require("express");
const router = express.Router();
const mailService = require("../services/mail");

router.post("/", (req, res) => {
  const { name, items } = req.body;

  if (!name) return res.status(400).send("お名前がありません");
  if (!items || items.length === 0)
    return res.status(400).send("カートが空です");

  const text =
    `注文者：${name}\n\n` +
    items.map((i) => `${i.bean} - ${i.roast} - ${i.qty}個`).join("\n");

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: "コーヒー注文",
    text,
  };

  mailService.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("送信に失敗しました");
    } else {
      res.send("注文を送信しました！");
    }
  });
});

module.exports = router;
