import { comments, users, posts } from '../../data/dummy.js';

export const commentResolvers = {
  Query: {
    // Fetch all comments
    comments: () => comments,
    
    // Fetch a specific comment by ID
    comment: (_, { id }) => comments.find(comment => comment.id === id) || null,
    
    // Fetch comments for a specific post
    commentsByPost: (_, { postId }) => comments.filter(comment => comment.postId === postId),
  },

  Mutation: {
    // Create a new comment
    createComment: (_, { input }) => {
      // Validate that post exists
      const post = posts.find(post => post.id === input.postId);
      if (!post) {
        throw new Error(`Post with id ${input.postId} not found`);
      }

      // Validate that author exists
      const author = users.find(user => user.id === input.authorId);
      if (!author) {
        throw new Error(`Author with id ${input.authorId} not found`);
      }

      // Create new comment with generated ID and timestamp
      const newComment = {
        id: generateId(),
        content: input.content,
        postId: input.postId,
        authorId: input.authorId,
        createdAt: new Date().toISOString(),
      };

      // Add to comments array
      comments.push(newComment);

      return newComment;
    },

    // Delete a comment by ID
    deleteComment: (_, { id }) => {
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex === -1) {
        return {
          success: false,
          message: `Comment with id ${id} not found`,
        };
      }

      // Remove comment from array
      comments.splice(commentIndex, 1);

      return {
        success: true,
        message: `Comment with id ${id} successfully deleted`,
      };
    },
  },

  Comment: {
    // Resolve the author of the comment
    author: (parent) => users.find(user => user.id === parent.authorId),
    
    // Resolve the post this comment belongs to
    post: (parent) => posts.find(post => post.id === parent.postId),
  },
};