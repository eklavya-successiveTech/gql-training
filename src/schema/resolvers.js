import { userResolvers } from "../modules/user/user.resolver.js";
import { postResolvers } from "../modules/post/post.resolver.js";
import { commentResolvers } from "../modules/comment/comment.resolver.js";

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
  },
};
