require("dotenv").config();
const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST"],
  }),
);

// JSON parser
app.use(express.json());

// Routes
app.use("/api/sendOrder", orderRoutes);

// Start server
app.listen(PORT, () => {});
