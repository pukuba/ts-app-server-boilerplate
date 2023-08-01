import { FriendlySeconds, dateToTimestampInSeconds, encrypt, getCurrentTimestampInSeconds, logger } from "~/common";
import { BLACKLIST_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/common/lib/cache";
import { AuthTokenPayload } from "~/entity";
import { AuthenticationErrorCase, Resolvers } from "~/graphql/__generated__";
import { MercuriusContext } from "~/graphql/types";
import { GraphQLAuthenticationError, createAuthenticationError } from "~/graphql/utils";
import { User } from "~/services/__generated__/prisma";

const verifyRefreshToken = async (context: MercuriusContext): Promise<GraphQLAuthenticationError | User & { refreshToken: string; now: number; }> => {
  const refreshTokenHeader = context.request.headers["refresh-token"];
  const refreshToken = Array.isArray(refreshTokenHeader) ? refreshTokenHeader?.[0] : refreshTokenHeader;
  if (!refreshToken) {
    return createAuthenticationError(AuthenticationErrorCase.MissingAuthToken, "No refresh token provided. Please include your refresh token in the request headers.");
  }

  const userId = refreshToken.slice(0, 24);

  const tokenScore = await context.redis.zscore(REFRESH_TOKEN_KEY(userId), refreshToken.slice(24));
  if (tokenScore === null) {
    return createAuthenticationError(AuthenticationErrorCase.InvalidToken, "The provided refresh token is invalid. Please check your refresh token and try again.");
  }

  const now = getCurrentTimestampInSeconds();
  if (tokenScore + FriendlySeconds.ONE_MINUTE * 30 < now) {
    return createAuthenticationError(AuthenticationErrorCase.Expired, "Your refresh token has expired. Please log in again to renew your refresh token.");
  }

  const [error, viewer] = await context.prisma.user.findUnique({ where: { id: userId } }).then((user) => [null, user] as const).catch((error: unknown) => [error, null] as const);
  if (error || !viewer) {
    if (error) {
      logger.error(error);
    }
    return createAuthenticationError(error ? AuthenticationErrorCase.Unknown : AuthenticationErrorCase.NonExistentUser);
  }
  return { ...viewer, refreshToken, now };
};

export const AuthMutation: Resolvers["Mutation"] = {
  logout: async (parent, args, context) => {
    const verifiedUserWithToken = await verifyRefreshToken(context);
    if ("resolveType" in verifiedUserWithToken) {
      return verifiedUserWithToken;
    }
    const { refreshToken, now } = verifiedUserWithToken;
    const [error, viewer] = await context.viewer();
    if (error || !viewer) {
      return createAuthenticationError(error ?? AuthenticationErrorCase.NonExistentUser);
    }
    await Promise.all([
      context.redis.zrem(REFRESH_TOKEN_KEY(refreshToken.slice(0, 24)), refreshToken.slice(24)),
      context.redis.set(BLACKLIST_TOKEN_KEY(viewer.authToken), "", {
        duration: Math.max(dateToTimestampInSeconds(new Date(viewer.tokenPayload.exp)) - now, 60),
        mode: "EX",
      }),
    ]);
    return {
      __typename: "LogoutPayload",
      user: viewer,
    };
  },
  refreshAccessToken: async (parent, args, context) => {
    const verifiedUserWithToken = await verifyRefreshToken(context);
    if ("resolveType" in verifiedUserWithToken) {
      return verifiedUserWithToken;
    }
    const accessToken = await encrypt<AuthTokenPayload>({ id: verifiedUserWithToken.id, email: verifiedUserWithToken.email }, "30 m");
    return {
      __typename: "RefreshAccessTokenPayload",
      accessToken,
    };
  },
};
