import { Comment, User, Post } from '../../models/index.js'; // ← ONLY CHANGE THIS LINE
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

export const commentResolvers = {
  Query: {
    // Fetch all comments
    comments: async () => await Comment.find({}), // ← CHANGED
    
    // Fetch a specific comment by ID
    comment: async (_, { id }) => await Comment.findOne({ id }), // ← CHANGED
    
    // Fetch comments for a specific post
    commentsByPost: async (_, { postId }) => await Comment.find({ postId }), // ← CHANGED
  },

  Mutation: {
    // Create a new comment
    createComment: async (_, { input }, { pubsub }) => { // ← ADD async
      // Validate that post exists
      const post = await Post.findOne({ id: input.postId }); // ← CHANGED
      if (!post) {
        throw new Error(`Post with id ${input.postId} not found`);
      }

      // Validate that author exists
      const author = await User.findOne({ id: input.authorId }); // ← CHANGED
      if (!author) {
        throw new Error(`Author with id ${input.authorId} not found`);
      }

      // Create new comment
      const newComment = new Comment({
        content: input.content,
        postId: input.postId,
        authorId: input.authorId,
      });

      await newComment.save(); // ← CHANGED

      // Publish subscription events
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.COMMENT_ADDED, {
          commentAdded: newComment,
        });
      }

      return newComment;
    },

    // Delete a comment by ID
    deleteComment: async (_, { id }, { pubsub }) => { // ← ADD async
      const deletedComment = await Comment.findOneAndDelete({ id }); // ← CHANGED
      
      if (!deletedComment) {
        const response = {
          success: false,
          message: `Comment with id ${id} not found`,
        };
        
        return response;
      }

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
    author: async (parent) => await User.findOne({ id: parent.authorId }), // ← CHANGED
    
    // Resolve the post this comment belongs to
    post: async (parent) => await Post.findOne({ id: parent.postId }), // ← CHANGED
  },
};