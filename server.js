const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./utils/db");

dotenv.config();

const app = express();

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",           // local dev
  "https://shiv-auto.netlify.app",   // deployed frontend (with https)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routers
const authRouter = require("./router/auth-router");
const contactRouter = require("./router/contact-router");
const productRouter = require("./router/product-router");

app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/products", productRouter);

// ✅ Connect DB
connectDb();

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

