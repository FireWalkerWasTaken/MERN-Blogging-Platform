import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at: ${process.env.MONGO_URL}`);
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected (Post Service)");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
