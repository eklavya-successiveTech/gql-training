import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const commentTypeDefs = readFileSync(join(__dirname, 'comment.graphql'), 'utf-8');
export { commentResolvers } from './comment.resolvers.js';