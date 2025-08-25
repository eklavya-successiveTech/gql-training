import { User, Message } from '../../models/index.js'; // ← ADD THIS LINE
import { SUBSCRIPTION_EVENTS } from '../../server/pubsub.js';
import jwt from 'jsonwebtoken';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const messageResolvers = {
  Query: {
    // Question 5: Fetch message history
    messages: async () => await Message.find({}).sort({ timestamp: -1 }), // ← CHANGED
  },

  Mutation: {
    // Question 3: Simple login
    login: async (_, { input }) => { // ← ADD async
      const user = await User.findOne({ email: input.email }); // ← CHANGED
      if (!user) throw new Error('User not found');
      
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
    sendMessage: async (_, { input }, { pubsub, user }) => { // ← ADD async
      if (!user) throw new Error('Must be logged in');
      
      const message = new Message({
        content: input.content,
        authorId: user.id,
      });
      
      await message.save(); // ← CHANGED
      
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
    author: async (parent) => await User.findOne({ id: parent.authorId }), // ← CHANGED
  },
};