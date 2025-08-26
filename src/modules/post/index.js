import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const postTypeDefs = readFileSync(join(__dirname, 'post.graphql'), 'utf-8');
export { postResolvers } from './post.resolvers.js';