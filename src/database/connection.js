import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // For local MongoDB (default when you install MongoDB Compass)
    await mongoose.connect('mongodb://localhost:27017/graphql_blog');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;