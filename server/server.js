const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5001;

// CORS 設定
app.use(cors({
  origin: "http://localhost:3000", // React の URL
  methods: ["GET", "POST"]
}));

// JSON パース
app.use(express.json());

// Gmail 設定
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "s.nakamura04510@gmail.com",   // ← 自分の Gmail
    pass: "tlqxpbzqwbuu cfmd"            // ← 生成したアプリパスワード
  }
});

// 注文送信用エンドポイント
app.post("/api/sendOrder", (req, res) => {
  console.log("受け取ったデータ:", req.body);

  const { name, items } = req.body;

  if (!name) return res.status(400).send("お名前がありません");
  if (!items || items.length === 0) return res.status(400).send("カートが空です");

  const text = `注文者：${name}\n\n` +
    items.map(i => `${i.bean} - ${i.roast} - ${i.qty}個`).join("\n");

  const mailOptions = {
    from: "s.nakamura04510@gmail.com",
    to: "s.nakamura04510@gmail.com", // ← 受け取りたいメールアドレス
    subject: "コーヒー注文",
    text
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("送信に失敗しました");
    } else {
      console.log("Email sent: " + info.response);
      res.send("注文を送信しました！");
    }
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});