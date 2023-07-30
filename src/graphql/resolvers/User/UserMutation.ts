import { Resolvers } from "~/graphql/__generated__";
import { UNIQUE_CONSTRAINT_ERROR_CODE } from "~/services/prisma";
import { createErrorWithSuggestion, createUnknownError } from "~/graphql/utils";
import { encrypt, createHash, prismaTo } from "@common/lib";
import { AuthTokenPayload } from "~/entity";

export const UserMutation: Resolvers["Mutation"] = {
  createUser: async (parent, args, context, info) => {
    const hash = await createHash(args.input.password);
    const [err, user] = await prismaTo(
      context.prisma.user.create({
        data: {
          email: args.input.email,
          password: hash,
        },
      }),
    );
    if (err?.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
      const suggestion = "Try another email";
      const message = "Email already exists";
      return createErrorWithSuggestion(message, suggestion);
    }
    if (err || !user) {
      const message = "Failed to create user";
      context.request.log.error(err);
      return createUnknownError(message, info);
    }
    return {
      user,
      token: await encrypt<AuthTokenPayload>({ id: user.id, email: user.email }, "60 s"),
      __typename: "CreateUserPayload",
    };
  },
};
