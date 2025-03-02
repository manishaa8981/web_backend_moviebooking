const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const connectDB = async () => {
  try {
    const dbURI =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_DATABASE
        : process.env.MONGO_URI; // Use test DB if in test mode

    await mongoose.connect(dbURI);

    console.log(` MongoDB Connected: ${dbURI}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);

    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
