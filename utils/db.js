const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    console.log("🔍 MONGO_URI:", process.env.MONGO_URI?.slice(0, 30) + "..."); // partial log for safety

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // wait 30s before timing out
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Stack:", error.stack);

    console.error(
      "💡 Hint: Check your IP whitelist in MongoDB Atlas and ensure your MONGO_URI is correct."
    );
    process.exit(1);
  }
};

module.exports = connectDb;
