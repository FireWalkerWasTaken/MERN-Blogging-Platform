import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    console.log('Attempting to connect to MongoDB at:', mongoUrl);
    
    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
