import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = 'your-super-secure-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Generate JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token (secure version)
export const verifyToken = (token) => {
  try {
    const cleanToken = token.replace('Bearer ', '');
    return jwt.verify(cleanToken, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

// Get user from token (enhanced version)
export const getUserFromToken = async (token) => {
  try {
    if (!token) return null;
    
    // Verify token (secure)
    const decoded = verifyToken(token);
    
    if (!decoded || !decoded.userId) return null;
    
    // Find active user
    const user = await User.findOne({ 
      id: decoded.userId,
      isActive: true 
    });
    
    return user || null;
    
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

// Authorization helpers
export const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireRole = (user, roles = []) => {
  requireAuth(user);
  
  if (roles.length && !roles.includes(user.role)) {
    throw new Error(`Access denied. Required roles: ${roles.join(', ')}`);
  }
  
  return user;
};

// Check if user can access resource
export const canAccessResource = (user, resource) => {
  requireAuth(user);
  
  // User can access their own resources
  if (resource.authorId === user.id) return true;
  
  // Admins can access everything
  if (user.role === 'ADMIN') return true;
  
  // Moderators can access non-admin resources
  if (user.role === 'MODERATOR' && resource.author?.role !== 'ADMIN') return true;
  
  return false;
};