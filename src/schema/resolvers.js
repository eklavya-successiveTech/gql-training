import _ from "lodash";
const { merge } = _;

// Import individual module resolvers
import { authResolvers } from '../modules/auth/index.js';
import { userResolvers } from '../modules/user/index.js';
import { postResolvers } from '../modules/post/index.js';
import { commentResolvers } from '../modules/comment/index.js';
import { messageResolvers } from "../modules/messages/index.js";
import { presenceResolvers } from '../modules/presence/index.js';

// Merge all resolvers using lodash merge to handle nested objects properly
// This ensures Query, Mutation, and type resolvers are combined correctly
export const resolvers = merge(
  {},
  authResolvers,
  userResolvers,
  postResolvers,
  commentResolvers,
  messageResolvers,    
  presenceResolvers
);