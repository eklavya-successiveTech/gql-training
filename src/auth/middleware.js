import jwt from 'jsonwebtoken';
import { users } from '../data/dummy.js';

// Mock JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simple function to get user from token
export const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    
    // Remove 'Bearer ' if present
    const cleanToken = token.replace('Bearer ', '');
    
    // For our simple implementation, just decode without verification
    // In production, use jwt.verify()
    const decoded = jwt.decode(cleanToken);
    
    if (!decoded || !decoded.userId) return null;
    
    // Find user in our dummy data
    const user = users.find(u => u.id === decoded.userId);
    return user || null;
    
  } catch (error) {
    console.error('Token error:', error);
    return null;
  }
};