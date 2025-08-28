import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Enhanced User Schema with authentication fields
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: String,
  // NEW: Authentication fields
  password: { 
    type: String, 
    required: function() { 
      return !this.googleId && !this.githubId; // Required if no OAuth
    },
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ['USER', 'ADMIN', 'MODERATOR'], 
    default: 'USER' 
  },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  // OAuth fields
  googleId: String,
  githubId: String,
  avatar: String,
  // Security fields
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, { 
  timestamps: true,
  toJSON: { 
    transform: (doc, ret) => { 
      delete ret._id; 
      delete ret.__v; 
      delete ret.password; // Never return password in JSON
      return ret; 
    } 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

// Increment login attempts
userSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Reset login attempts on successful login
userSchema.methods.resetLoginAttempts = async function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Keep existing models unchanged
const postSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, {
  toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } }
});

const commentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  postId: { type: String, required: true },
  authorId: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, {
  toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } }
});

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, {
  toJSON: { transform: (doc, ret) => { delete ret._id; delete ret.__v; return ret; } }
});

export const User = mongoose.model('User', userSchema);
export const Post = mongoose.model('Post', postSchema);
export const Comment = mongoose.model('Comment', commentSchema);
export const Message = mongoose.model('Message', messageSchema);