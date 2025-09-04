// db/connectDb.js
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("🔍 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // wait 30s before timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("💡 Check your Atlas IP whitelist and MONGO_URI.");
    process.exit(1);
  }
};

module.exports = connectDb;
