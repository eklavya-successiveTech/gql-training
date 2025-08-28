import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Import individual module typeDefs (now as strings from .graphql files)
import { authTypeDefs } from '../modules/auth/index.js';
import { userTypeDefs } from '../modules/user/index.js';
import { postTypeDefs } from '../modules/post/index.js';
import { commentTypeDefs } from '../modules/comment/index.js';
import { messageTypeDefs } from '../modules/messages/index.js';
import { presenceTypeDefs } from '../modules/presence/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load base schema from .graphql file
const baseTypeDefs = readFileSync(join(__dirname, 'base.graphql'), 'utf-8');

// Combine all type definitions into a single array
export const typeDefs = [
  baseTypeDefs,
  authTypeDefs,
  userTypeDefs,
  postTypeDefs,
  commentTypeDefs,
  messageTypeDefs,     
  presenceTypeDefs, 
];