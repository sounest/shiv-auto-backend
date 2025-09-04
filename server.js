// server.js
const express = require("express");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();
const connectDb = require("./utils/db");

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(compression()); // 🚀 speeds up response
app.disable("x-powered-by"); // security + small perf boost

// ✅ CORS Setup
const allowedOrigins = [
  "https://shiv-auto.netlify.app", // your frontend
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman/curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ✅ Routes
const productRoutes = require("./router/product-router");
app.use("/api/products", productRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Shiv Auto Backend is running fast!");
});

// ✅ Start server after DB connects
const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});

// ✅ Keep-alive ping (avoid Render free cold starts)
if (process.env.NODE_ENV === "production") {
  setInterval(() => {
    fetch("https://your-render-backend.onrender.com")
      .then(() => console.log("🔄 Keep-alive ping sent"))
      .catch(() => console.log("⚠️ Keep-alive failed"));
  }, 10 * 60 * 1000); // every 10 min
}
