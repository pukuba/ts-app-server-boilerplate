import { Resolvers } from "~/graphql/__generated__";
import { createHash } from "~/common/lib/crypto";
import { prismaTo } from "~/common";
import { UNIQUE_CONSTRAINT_ERROR_CODE } from "~/services/prisma";
import { createErrorWithSuggestion, createUnknownError } from "~/graphql/utils";

export const UserMutation: Resolvers["Mutation"] = {
  createUser: async(parent, args, context, info) => {
    const hash = await createHash(args.input.password);
    const [err, user] = await prismaTo(
      context.prisma.user.create({
        data: {
          email: args.input.email,
          password: hash,
        },
      }),
    );
    if(err?.code === UNIQUE_CONSTRAINT_ERROR_CODE){
      const suggestion = "Try another email";
      const message = "Email already exists";
      return createErrorWithSuggestion(message, suggestion);
    }
    if(err || !user) {
      const message = "Failed to create user";
      context.request.log.error(err);
      return createUnknownError(message, info);
    }
    return {
      user,
      __typename: "CreateUserPayload",
    };
  },
};
