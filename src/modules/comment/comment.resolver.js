export const commentResolvers = {
  Query: {
    getComment: (_, { id }) => ({
      id,
      text: "Nice post!",
      author: { id: "2", name: "Jane Smith", email: "jane@example.com" },
      post: { id: "1", title: "Hello World", content: "This is a blog post" },
    }),
    getComments: () => [
      {
        id: "1",
        text: "Nice post!",
        author: { id: "2", name: "Jane Smith", email: "jane@example.com" },
        post: { id: "1", title: "Hello World", content: "This is a blog post" },
      },
    ],
  },
};
