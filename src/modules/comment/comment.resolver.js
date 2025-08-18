import { comments, users, posts } from "../data.js";

export const commentResolvers = {
  Query: {
    getComment: (_, { id }) => comments.find((c) => c.id === id),
    getComments: () => comments,
  },

  Mutation: {
    addComment: (_, { postId, content, authorId }) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) throw new Error("Post not found");

      const author = users.find((u) => u.id === authorId);
      if (!author) throw new Error("Author not found");

      const newComment = {
        id: String(comments.length + 101),
        content,
        author: authorId,
        postId,
      };

      comments.push(newComment);
      post.comments.push(newComment.id);

      return newComment;
    },
  },

  Comment: {
    author: (comment) => users.find((u) => u.id === comment.author),
  },
};
