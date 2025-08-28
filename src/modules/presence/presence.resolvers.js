import { User } from '../../models/index.js'; 
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

// Simple online users store (keep in memory for now)
const onlineUsers = new Set();

export const presenceResolvers = {
  Query: {
    // Question 4: Get online users
    onlineUsers: () => {
      return Array.from(onlineUsers).map(userId => ({
        userId,
        isOnline: true
      }));
    },
  },

  Mutation: {
    // Question 4: Join chat
    joinChat: (_, __, { pubsub, user }) => {
      if (!user) throw new Error('Must be logged in');
      
      onlineUsers.add(user.id);
      
      const presence = {
        userId: user.id,
        isOnline: true
      };
      
      // Notify subscribers
      pubsub.publish(SUBSCRIPTION_EVENTS.USER_JOINED, {
        userJoined: presence
      });
      
      return presence;
    },
    
    // Question 4: Leave chat
    leaveChat: (_, __, { pubsub, user }) => {
      if (!user) return false;
      
      onlineUsers.delete(user.id);
      
      const presence = {
        userId: user.id,
        isOnline: false
      };
      
      // Notify subscribers
      pubsub.publish(SUBSCRIPTION_EVENTS.USER_LEFT, {
        userLeft: presence
      });
      
      return true;
    },
  },

  Subscription: {
    // Question 4: User joined notification
    userJoined: {
      subscribe: (_, __, { pubsub }) => 
        pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.USER_JOINED]),
    },
    
    // Question 4: User left notification  
    userLeft: {
      subscribe: (_, __, { pubsub }) => 
        pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.USER_LEFT]),
    },
  },

  // Resolve user info
  UserPresence: {
    user: async (parent) => await User.findOne({ id: parent.userId }), // ← CHANGED
  },
};