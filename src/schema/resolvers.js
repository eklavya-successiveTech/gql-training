import { userResolvers } from "../modules/user/user.resolver.js";
import { postResolvers } from "../modules/post/post.resolver.js";
import { commentResolvers } from "../modules/comment/comment.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  // include union/type resolvers explicitly
  UserResult: userResolvers.UserResult,
  // (Add other unions here later if you create them, e.g., PostResult, CommentResult)
};
