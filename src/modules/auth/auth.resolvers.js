import { User } from '../../models/index.js';
import { generateToken, requireAuth, requireRole } from '../../auth/middleware.js';
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

// Generate unique ID helper
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

export const authResolvers = {
  Query: {
    // Get current user info
    me: async (_, __, { user }) => {
      return requireAuth(user);
    },
    
    // Admin only: Get all users
    allUsers: async (_, { page = 1, limit = 10 }, { user }) => {
      requireRole(user, ['ADMIN']);
      
      const skip = (page - 1) * limit;
      const users = await User.find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
      const total = await User.countDocuments({ isActive: true });
      
      return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }
  },

  Mutation: {
    // User Registration
    register: async (_, { input }, { pubsub }) => {
      const { name, email, password, confirmPassword } = input;
      
      // Validation
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create user
      const user = new User({
        id: generateId(),
        name,
        email,
        password
      });
      
      await user.save();
      
      // Generate token
      const token = generateToken(user);
      
      // Publish subscription
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.USER_REGISTERED, {
          userRegistered: user
        });
      }
      
      return {
        token,
        user,
        message: 'Registration successful'
      };
    },
    
    // User Login (Enhanced)
    login: async (_, { input }) => {
      const { email, password } = input;
      
      // Find user
      const user = await User.findOne({ email, isActive: true });
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check if account is locked
      if (user.isLocked()) {
        throw new Error('Account temporarily locked due to too many failed login attempts');
      }
      
      // Verify password
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        // Increment failed attempts
        await user.incLoginAttempts();
        throw new Error('Invalid email or password');
      }
      
      // Reset failed attempts on successful login
      await user.resetLoginAttempts();
      
      // Generate token
      const token = generateToken(user);
      
      return {
        token,
        user,
        message: 'Login successful'
      };
    },
    
    // Change Password
    changePassword: async (_, { input }, { user }) => {
      const { currentPassword, newPassword, confirmPassword } = input;
      
      requireAuth(user);
      
      // Validation
      if (newPassword !== confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }
      
      // Get full user with password
      const fullUser = await User.findOne({ id: user.id }).select('+password');
      
      // Verify current password
      const isCurrentPasswordValid = await fullUser.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }
      
      // Update password
      fullUser.password = newPassword;
      await fullUser.save();
      
      return {
        success: true,
        message: 'Password changed successfully'
      };
    },
    
    // Update Profile
    updateProfile: async (_, { input }, { user, pubsub }) => {
      requireAuth(user);
      
      const updatedUser = await User.findOneAndUpdate(
        { id: user.id },
        { ...input },
        { new: true, runValidators: true }
      );
      
      // Publish subscription
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.USER_UPDATED, {
          userUpdated: updatedUser
        });
      }
      
      return updatedUser;
    },
    
    // Admin: Deactivate User
    deactivateUser: async (_, { userId }, { user }) => {
      requireRole(user, ['ADMIN']);
      
      const targetUser = await User.findOneAndUpdate(
        { id: userId },
        { isActive: false },
        { new: true }
      );
      
      if (!targetUser) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        message: `User ${targetUser.name} has been deactivated`
      };
    }
  },

  Subscription: {
    // Subscribe to new user registrations (admin only in production)
    userRegistered: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.USER_REGISTERED]),
    }
  }
};