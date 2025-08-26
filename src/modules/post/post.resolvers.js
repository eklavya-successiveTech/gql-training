import { posts, users, comments } from '../../data/dummy.js';

export const postResolvers = {
  Query: {
    // Fetch all posts
    posts: () => posts,
    
    // Fetch a specific post by ID
    post: (_, { id }) => posts.find(post => post.id === id) || null,
    
    // Fetch posts by a specific author
    postsByAuthor: (_, { authorId }) => posts.filter(post => post.authorId === authorId),

    paginatedPosts: (_, { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" }) => {
  // Sort posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a[sortBy]) - new Date(b[sortBy]);
    } else {
      return new Date(b[sortBy]) - new Date(a[sortBy]);
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
    createPost: (_, { input }) => {
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

      return newPost;
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