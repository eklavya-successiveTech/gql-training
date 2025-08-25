import { User, Post, Comment } from '../../models/index.js'; 
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';
import { requireAuth, requireRole } from '../../auth/middleware.js';

// Utility function for artificial delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userResolvers = {
  Query: {
    // Fetch all users with artificial delay
    users: async () => {
      await delay(2000);
      return await User.find({}); 
    },
    
    // Fetch a specific user by ID with error handling
    user: async (_, { id }) => {
      await delay(1500);
      const foundUser = await User.findOne({ id }); 
      
      if (!foundUser) {
        return {
          code: "USER_NOT_FOUND",
          message: `User with id ${id} not found`
        };
      }
      
      return foundUser; 
    },
  },

  Mutation: {
    // Admin-only: Update any user's basic information
    updateUser: async (_, { id, input }, { user, pubsub }) => {
      // Require admin role for updating other users
      requireRole(user, ['ADMIN']);
      
      const updatedUser = await User.findOneAndUpdate(
        { id }, 
        input, 
        { new: true }
      );
      
      if (!updatedUser) {
        return {
          code: "USER_NOT_FOUND",
          message: `User with id ${id} not found`
        };
      }

      // Publish subscription event only for successful updates
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.USER_UPDATED, {
          userUpdated: updatedUser,
        });
      }

      return updatedUser;
    },
  },

  Subscription: {
    // Subscribe to user profile updates
    userUpdated: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.USER_UPDATED]),
    },
  },

  // Union type resolver - determines which type to return
  UserResult: {
    __resolveType(obj) {
      if (obj.id) return "User";
      if (obj.code) return "Error";
      return null;
    }
  }, 

  User: {
    // Resolve posts authored by this user
    posts: async (parent) => await Post.find({ authorId: parent.id }), 
    
    // Resolve comments made by this user
    comments: async (parent) => await Comment.find({ authorId: parent.id }), 
  },
};