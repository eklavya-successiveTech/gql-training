import { users, posts, comments } from '../../data/dummy.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userResolvers = {
  Query: {
    // Fetch all users
    users: async () => {
      await delay(2000);
      return users;
    },
    
    // Fetch a specific user by ID
    user: async(_, { id }) => {
      await delay(1500);
      const foundUser = users.find(user => user.id === id) || null;
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
    // Update user information
    updateUser: (_, { id, input }) => {
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

      return updatedUser;
    },
  },
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