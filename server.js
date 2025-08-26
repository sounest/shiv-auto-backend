const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");   // ✅ Import CORS
const connectDb = require("./utils/db");

dotenv.config(); // ✅ load .env first

const app = express();

// ✅ Enable CORS for all origins (or restrict to your frontend)
// server.js


app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true,
}));


app.use(express.json());

// ✅ Import Routers
const authRouter = require("./router/auth-router");
const contactRouter = require("./router/contact-router");
const productRouter = require("./router/product-router");
// const billRouter = require("./router/bill-router");

// ✅ Use Routers
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);
app.use("/api/products", productRouter);
// app.use("/api/bills", billRouter);

// ✅ Connect to DB
connectDb();

// ✅ Start Server
app.listen( 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
