import { users, posts, comments } from '../../data/dummy.js';
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

// Utility function for artificial delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userResolvers = {
  Query: {
    // Fetch all users with artificial delay
    users: async () => {
      await delay(2000);
      return users;
    },
    
    // Fetch a specific user by ID with error handling
    user: async (_, { id }) => {
      await delay(1500);
      const foundUser = users.find(user => user.id === id);
      
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
    // Update user information with error handling
    updateUser: (_, { id, input }, { pubsub }) => {
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        return {
          code: "USER_NOT_FOUND",
          message: `User with id ${id} not found`
        };
      }

      // Update user with provided fields
      const updatedUser = {
        ...users[userIndex],
        ...input, // Spread input to update only provided fields
      };

      // Update the user in the array
      users[userIndex] = updatedUser;

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
    posts: (parent) => posts.filter(post => post.authorId === parent.id),
    
    // Resolve comments made by this user
    comments: (parent) => comments.filter(comment => comment.authorId === parent.id),
  },
};