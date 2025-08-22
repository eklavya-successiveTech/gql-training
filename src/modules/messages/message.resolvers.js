import { users } from '../../data/dummy.js';
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';
import jwt from 'jsonwebtoken'; // ← ADD THIS IMPORT

// Simple in-memory messages store
export const messages = [
  {
    id: '1',
    content: 'Hey everyone! Welcome to our chat app!',
    authorId: '1',
    timestamp: '2024-08-22T10:00:00Z',
  },
  {
    id: '2',
    content: 'This GraphQL chat is awesome! 🚀',
    authorId: '2',
    timestamp: '2024-08-22T10:05:00Z',
  },
  {
    id: '3',
    content: 'Love the real-time subscriptions!',
    authorId: '3',
    timestamp: '2024-08-22T10:10:00Z',
  },
];

// Simple ID generator
const generateId = () => Date.now().toString();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const messageResolvers = {
  Query: {
    // Question 5: Fetch message history
    messages: () => messages,
  },

  Mutation: {
    // Question 3: Simple login (no real auth, just return user)
    login: (_, { input }) => {
      const user = users.find(u => u.email === input.email);
      if (!user) throw new Error('User not found');
      
      // Create a real JWT token with ES6 import
      const token = jwt.sign(
        { userId: user.id, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      return {
        token,
        user
      };
    },
    
    // Question 3: Send message
    sendMessage: (_, { input }, { pubsub, user }) => {
      if (!user) throw new Error('Must be logged in');
      
      const message = {
        id: generateId(),
        content: input.content,
        authorId: user.id,
        timestamp: new Date().toISOString(),
      };
      
      messages.push(message);
      
      // Notify subscribers
      pubsub.publish(SUBSCRIPTION_EVENTS.MESSAGE_ADDED, {
        messageAdded: message
      });
      
      return message;
    },
  },

  Subscription: {
    // Question 3: Real-time messages
    messageAdded: {
      subscribe: (_, __, { pubsub }) => 
        pubsub.asyncIterableIterator([SUBSCRIPTION_EVENTS.MESSAGE_ADDED]),
    },
  },

  // Resolve author
  Message: {
    author: (parent) => users.find(u => u.id === parent.authorId),
  },
};