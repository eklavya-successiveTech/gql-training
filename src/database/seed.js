import { User, Post, Comment } from '../models/index.js';
import { users, posts, comments } from '../data/dummy.js';
import connectDB from './connection.js';

const seedData = async () => {
  await connectDB();
  
  // Clear existing data
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  
  // Import your exact dummy data
  await User.insertMany(users);
  await Post.insertMany(posts);
  await Comment.insertMany(comments);
  
  console.log('✅ Dummy data imported successfully!');
  process.exit(0);
};

seedData();