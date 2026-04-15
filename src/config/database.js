const mongoose = require("mongoose");

async function connectDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not defined in env file");

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = connectDatabase;
