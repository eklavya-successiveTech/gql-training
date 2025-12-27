import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const messageTypeDefs = readFileSync(join(__dirname, 'message.graphql'), 'utf-8');
export { messageResolvers } from './message.resolvers.js';