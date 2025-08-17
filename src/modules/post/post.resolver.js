export const postResolvers = {
  Query: {
    getPost: (_, { id }) => ({
      id,
      title: "Hello World",
      content: "This is a blog post",
      author: { id: "1", name: "John Doe", email: "john@example.com" },
      comments: [],
    }),
    getPosts: () => [
      {
        id: "1",
        title: "Hello World",
        content: "This is a blog post",
        author: { id: "1", name: "John Doe", email: "john@example.com" },
        comments: [],
      },
    ],
  },
};
