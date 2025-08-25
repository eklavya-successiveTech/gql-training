export const userResolvers = {
  Query: {
    getUser: (_, { id }) => ({
      id,
      name: "John Doe",
      email: "john@example.com",
      posts: [],
    }),
    getUsers: () => [
      { id: "1", name: "John Doe", email: "john@example.com", posts: [] },
      { id: "2", name: "Jane Smith", email: "jane@example.com", posts: [] },
    ],
  },
};
