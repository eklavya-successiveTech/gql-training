import { Post, User, Comment } from '../../models/index.js'; 
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

export const postResolvers = {
  Query: {
    // Fetch all posts
    posts: async () => await Post.find({}), 
    
    // Fetch a specific post by ID
    post: async (_, { id }) => await Post.findOne({ id }), 
    
    // Fetch posts by a specific author
    postsByAuthor: async (_, { authorId }) => await Post.find({ authorId }), 

    // Fetch paginated posts with sorting
    paginatedPosts: async (_, { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" }) => {
      const skip = (page - 1) * limit;
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
      
      const data = await Post.find({})
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
      
      const total = await Post.countDocuments(); 
      const totalPages = Math.ceil(total / limit);

      return {
        data,
        total,
        page,
        limit,
        totalPages
      };
    }
  },

  Mutation: {
    // Create a new post
    createPost: async (_, { input }, { pubsub }) => { 
      // Validate that author exists
      const author = await User.findOne({ id: input.authorId }); 
      if (!author) {
        throw new Error(`Author with id ${input.authorId} not found`);
      }

      // Create new post - let MongoDB auto-generate ID
      const newPost = new Post({
        title: input.title,
        content: input.content,
        authorId: input.authorId,
      });

      await newPost.save(); 

      // Publish subscription event
      if (pubsub) {
        pubsub.publish(SUBSCRIPTION_EVENTS.POST_ADDED, {
          postAdded: newPost,
        });
      }

      return newPost;
    },
  },
  
  Subscription: {
    // Subscribe to new posts being created
    postAdded: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.POST_ADDED]),
    },

    // Subscribe to new comments on a specific post
    commentAddedToPost: {
      subscribe: (_, { postId }, { pubsub }) => {
        const iterator = pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]);
        
        return {
          [Symbol.asyncIterator]: async function* () {
            for await (const payload of iterator) {
              if (payload.commentAdded && payload.commentAdded.postId === postId) {
                yield { commentAddedToPost: payload.commentAdded };
              }
            }
          }
        };
      },
    },
  },

  Post: {
    // Resolve the author of the post
    author: async (parent) => await User.findOne({ id: parent.authorId }), 
    
    // Resolve comments for this post
    comments: async (parent) => await Comment.find({ postId: parent.id }), 
    
    // Computed field: Count of comments on this post
    commentCount: async (parent) => await Comment.countDocuments({ postId: parent.id }), 
  },
};