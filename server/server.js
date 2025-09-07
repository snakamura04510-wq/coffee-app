require("dotenv").config();
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  }),
);

// JSON parser
app.use(express.json());

// Routes
app.use("/api/sendOrder", orderRoutes);

// Start server
app.listen(PORT, () => {});
