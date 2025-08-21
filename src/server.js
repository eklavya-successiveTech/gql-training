import { ApolloServer } from 'apollo-server-express';
import express from 'express';

// Import combined schema from schema folder
import { typeDefs, resolvers } from './schema/index.js';

async function startServer() {
  // Create Express app
  const app = express();
  
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Enable GraphQL Playground in development
    introspection: true,
    playground: true,
    // Enhanced error formatting for development
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
      };
    },
  });

  // Start the server
  await server.start();
  
  // Apply Apollo GraphQL middleware
  server.applyMiddleware({ 
    app, 
    path: '/graphql',
    cors: {
      origin: true, // Allow all origins in development
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log('🚀 GraphQL Blogging Platform Server Ready!');
    console.log(`📍 Server running at: http://localhost:${PORT}`);
    console.log(`🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`);
    console.log('\n📝 Available Queries:');
    console.log('   • users, user(id)');
    console.log('   • posts, post(id), postsByAuthor(authorId)');
    console.log('   • comments, comment(id), commentsByPost(postId)');
    console.log('\n🔗 Relationships automatically resolved:');
    console.log('   • User.posts, User.comments');
    console.log('   • Post.author, Post.comments, Post.commentCount');
    console.log('   • Comment.author, Comment.post');
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});