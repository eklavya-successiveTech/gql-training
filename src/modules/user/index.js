import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const userTypeDefs = readFileSync(join(__dirname, 'user.graphql'), 'utf-8');
export { userResolvers } from './user.resolvers.js';