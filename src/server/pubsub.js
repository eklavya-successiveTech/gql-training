import { PubSub } from 'graphql-subscriptions';

// Create a single PubSub instance to be shared across the application
// This handles publishing and subscribing to real-time events
export const pubsub = new PubSub();

// Subscription event constants for type safety and consistency
export const SUBSCRIPTION_EVENTS = {
  POST_ADDED: 'POST_ADDED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  COMMENT_DELETED: 'COMMENT_DELETED',
  USER_UPDATED: 'USER_UPDATED',
  USER_REGISTERED: 'USER_REGISTERED',
  MESSAGE_ADDED: 'MESSAGE_ADDED',    
  USER_JOINED: 'USER_JOINED',        
  USER_LEFT: 'USER_LEFT',   
};