import { users } from "../data.js";

export const userResolvers = {
  Query: {
    // ⏳ simulate loading (2s) + return error if not found
    getUser: async (_, { id }) => {
      await new Promise((r) => setTimeout(r, 2000));
      const user = users.find((u) => u.id === id);
      if (!user) {
        return { message: `User with id ${id} not found`, code: "USER_NOT_FOUND" };
      }
      return user;
    },

    // keep this simple (no union)
    getUsers: async () => {
      await new Promise((r) => setTimeout(r, 500)); // small delay if you want
      return users;
    },
  },

  Mutation: {
    // ⏳ simulate loading (2s) + return error if not found
    updateUser: async (_, { id, name, email }) => {
      await new Promise((r) => setTimeout(r, 2000));
      const user = users.find((u) => u.id === id);
      if (!user) {
        return { message: `User with id ${id} not found`, code: "USER_NOT_FOUND" };
      }
      if (name != null) user.name = name;
      if (email != null) user.email = email;
      return user;
    },
  },

  // 🔐 union type resolver
  UserResult: {
    __resolveType(obj) {
      // If it has a 'code', it's our ErrorType
      if (obj.code) return "ErrorType";
      // If it has a 'email', it's a User
      if (obj.email) return "User";
      return null;
    },
  },
};
