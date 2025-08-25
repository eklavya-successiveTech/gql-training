import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const authTypeDefs = readFileSync(join(__dirname, 'auth.graphql'), 'utf-8');
export { authResolvers } from './auth.resolvers.js';