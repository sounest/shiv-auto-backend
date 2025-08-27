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
  "http://localhost:5173", // local dev
  "http://localhost:3000",
  "https://shiv-auto.netlify.app", // your frontend
  "https://www.shiv-auto.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🌍 Request Origin:", origin);

      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Allow Netlify subdomains & localhost
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        console.error("❌ CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
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
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Shiv Auto Backend is running!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
