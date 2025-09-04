// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ CORS Setup
const allowedOrigins = [
  "https://shiv-auto.netlify.app",
  "https://shiv-autos.netlify.app",
  "http://localhost:5173",
];

// ✅ Setup CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌍 Request Origin:", origin);

      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // ✅ Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ Block everything else
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Database connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
const productRoutes = require("./router/product-router");
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Shiv Auto Backend is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
