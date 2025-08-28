import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load GraphQL schema from .graphql file
export const presenceTypeDefs = readFileSync(join(__dirname, 'presence.graphql'), 'utf-8');
export { presenceResolvers } from './presence.resolvers.js';