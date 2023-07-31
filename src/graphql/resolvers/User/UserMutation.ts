import { Resolvers } from "~/graphql/__generated__";
import { UNIQUE_CONSTRAINT_ERROR_CODE } from "~/services/prisma";
import { createErrorWithSuggestion, createUnknownError } from "~/graphql/utils";
import { encrypt, createHash, prismaTo, FriendlySeconds, getCurrentTimestampInSeconds, to } from "@common/lib";
import { AuthTokenPayload } from "~/entity";
import hyperid from "hyperid";
import { REFRESH_TOKEN_KEY } from "~/common/lib/cache";
import { MercuriusContext } from "~/graphql/types";
import { User } from "~/services/__generated__/prisma";

const createRefreshToken = async (user: User, context: MercuriusContext): Promise<string> => {
  const uuid = hyperid().uuid;
  const now = getCurrentTimestampInSeconds();
  await context.redis.zaddWithZremRangeByScore(REFRESH_TOKEN_KEY(user.id), { member: uuid, score: now + FriendlySeconds.HALF_DAY }, 0, now)
    .then(async () => context.redis.expire(REFRESH_TOKEN_KEY(user.id), FriendlySeconds.HALF_DAY));
  return `${user.id}${uuid}`;
};

export const UserMutation: Resolvers["Mutation"] = {
  createUser: async (parent, args, context, info) => {
    const hash = await createHash(args.input.password);
    const [prismaError, user] = await prismaTo(
      context.prisma.user.create({
        data: {
          email: args.input.email,
          password: hash,
        },
      }),
    );

    if (prismaError?.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
      const suggestion = "Try another email";
      const message = "Email already exists";
      return createErrorWithSuggestion(message, suggestion);
    } else if (prismaError || !user) {
      const message = "Failed to create user";
      context.request.log.error(prismaError);
      return createUnknownError(message, info);
    }

    const [unknownError, [accessToken, refreshToken] = []] = await to (
      Promise.all([
        encrypt<AuthTokenPayload>({ id: user.id, email: user.email }, "30 m"),
        createRefreshToken(user, context),
      ]),
    );

    if (unknownError || !accessToken || !refreshToken) {
      const message = "Failed to generate access and refresh tokens";
      context.request.log.error(unknownError);
      return createUnknownError(message, info);
    }

    return {
      user,
      accessToken,
      refreshToken,
      __typename: "CreateUserPayload",
    };
  },
};
