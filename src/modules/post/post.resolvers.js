import { posts, users, comments } from '../../data/dummy.js';
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';

// Utility function to generate unique IDs
const generateId = () => (Math.max(...posts.map(p => parseInt(p.id))) + 1).toString();

export const postResolvers = {
  Query: {
    // Fetch all posts
    posts: () => posts,
    
    // Fetch a specific post by ID
    post: (_, { id }) => posts.find(post => post.id === id) || null,
    
    // Fetch posts by a specific author
    postsByAuthor: (_, { authorId }) => posts.filter(post => post.authorId === authorId),

    // Fetch paginated posts with sorting
    paginatedPosts: (_, { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" }) => {
      // Sort posts
      const sortedPosts = [...posts].sort((a, b) => {
        const aValue = sortBy === "createdAt" ? new Date(a[sortBy]) : a[sortBy];
        const bValue = sortBy === "createdAt" ? new Date(b[sortBy]) : b[sortBy];
        
        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return bValue > aValue ? 1 : -1;
        }
      });

      const total = sortedPosts.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = sortedPosts.slice(start, end);

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
    createPost: (_, { input }, { pubsub }) => {
      // Validate that author exists
      const author = users.find(user => user.id === input.authorId);
      if (!author) {
        throw new Error(`Author with id ${input.authorId} not found`);
      }

      // Create new post with generated ID and timestamp
      const newPost = {
        id: generateId(),
        title: input.title,
        content: input.content,
        authorId: input.authorId,
        createdAt: new Date().toISOString(),
      };

      // Add to posts array
      posts.push(newPost);

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
        // Create filtered async iterator for specific post
        const iterator = pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.COMMENT_ADDED]);
        
        // Return filtered iterator (note: this is a simplified approach)
        // In production, you'd want to use pubsub.asyncIterableIterator with proper filtering
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
    author: (parent) => users.find(user => user.id === parent.authorId),
    
    // Resolve comments for this post
    comments: (parent) => comments.filter(comment => comment.postId === parent.id),
    
    // Computed field: Count of comments on this post
    commentCount: (parent) => comments.filter(comment => comment.postId === parent.id).length,
  },
};