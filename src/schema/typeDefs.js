import path from "path";
import { fileURLToPath } from "url";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load base schema + all module schemas
const typesArray = loadFilesSync([
  path.join(__dirname, "./*.graphql"),              // <-- baseSchema.graphql
  path.join(__dirname, "../modules/**/*.graphql"),  // <-- module schemas
]);

export const typeDefs = mergeTypeDefs(typesArray);
