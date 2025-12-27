import { comments, users, posts } from '../../data/dummy.js';
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

// Utility function to generate unique IDs
const generateId = () => (Math.max(...comments.map(c => parseInt(c.id))) + 1).toString();

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
    createComment: (_, { input }, { pubsub }) => {
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

      // Publish subscription events
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_ADDED, {
          commentAdded: newComment,
        });
      }

      return newComment;
    },

    // Delete a comment by ID
    deleteComment: (_, { id }, { pubsub }) => {
      const commentIndex = comments.findIndex(comment => comment.id === id);
      
      if (commentIndex === -1) {
        const response = {
          success: false,
          message: `Comment with id ${id} not found`,
        };
        
        return response;
      }

      // Remove comment from array
      comments.splice(commentIndex, 1);

      const response = {
        success: true,
        message: `Comment with id ${id} successfully deleted`,
      };

      // Publish subscription event
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_DELETED, {
          commentDeleted: response,
        });
      }

      return response;
    },
  },

  Subscription: {
    // Subscribe to new comments being created
    commentAdded: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]),
    },

    // Subscribe to comments being deleted
    commentDeleted: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.COMMENT_DELETED]),
    },
  },

  Comment: {
    // Resolve the author of the comment
    author: (parent) => users.find(user => user.id === parent.authorId),
    
    // Resolve the post this comment belongs to
    post: (parent) => posts.find(post => post.id === parent.postId),
  },
};