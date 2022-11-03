const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to DB successfully");
  } catch (error) {
    console.log("Connection failed");
  }
};

module.exports = { connectDB };
