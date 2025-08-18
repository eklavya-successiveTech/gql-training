import { posts, users, comments } from "../data.js";

export const postResolvers = {
  Query: {
    getPost: (_, { id }) => posts.find((p) => p.id === id),

    // ✅ now supports pagination
    getPosts: (_, { limit, offset, sortBy = "date", order = "asc" }) => {
  let sortedPosts = [...posts];

  if (sortBy && posts[0][sortBy] !== undefined) {
    sortedPosts.sort((a, b) => {
      if (order === "desc") {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
      return a[sortBy] > b[sortBy] ? 1 : -1;
    });
  }

  const totalCount = sortedPosts.length;
  const paginatedPosts = sortedPosts.slice(offset, offset + limit);

  return {
    posts: paginatedPosts,
    totalCount,
    hasNextPage: offset + limit < totalCount,
    hasPrevPage: offset > 0,
  };
},

  },

  Mutation: {
    addPost: (_, { title, content, authorId }) => {
      const author = users.find((u) => u.id === authorId);
      if (!author) throw new Error("Author not found");

      const newPost = {
        id: String(posts.length + 1),
        title,
        content,
        author: authorId, // still storing just the authorId
        comments: [],
      };

      posts.push(newPost);
      author.posts.push(newPost.id);

      return newPost;
    },
  },

  Post: {
    author: (post) => users.find((u) => u.id === post.author),
    comments: (post) => comments.filter((c) => c.postId === post.id),
  },
};
