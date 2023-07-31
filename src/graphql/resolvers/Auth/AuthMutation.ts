import { FriendlySeconds, dateToTimestampInSeconds, getCurrentTimestampInSeconds } from "~/common";
import { BLACKLIST_TOKEN_KEY, REFRESH_TOKEN_KEY } from "~/common/lib/cache";
import { AuthenticationErrorCase, Resolvers } from "~/graphql/__generated__";
import { createAuthenticationError } from "~/graphql/utils";

export const AuthMutation: Resolvers["Mutation"] = {
  logout: async (parent, args, context) => {
    const refreshTokenHeader = context.request.headers["refresh-token"];
    const refreshToken = Array.isArray(refreshTokenHeader) ? refreshTokenHeader?.[0] : refreshTokenHeader;
    if (!refreshToken) {
      return createAuthenticationError(AuthenticationErrorCase.MissingAuthToken, "No refresh token provided. Please include your refresh token in the request headers.");
    }

    const tokenScore = await context.redis.zscore(REFRESH_TOKEN_KEY(refreshToken.slice(0, 24)), refreshToken.slice(24));
    if (tokenScore === null) {
      return createAuthenticationError(AuthenticationErrorCase.InvalidToken, "The provided refresh token is invalid. Please check your refresh token and try again.");
    }

    const now = getCurrentTimestampInSeconds();
    if (tokenScore + FriendlySeconds.ONE_MINUTE * 30 < now) {
      return createAuthenticationError(AuthenticationErrorCase.Expired, "Your refresh token has expired. Please log in again to renew your refresh token.");
    }

    const [error, viewer] = await context.viewer();
    if (error) {
      return createAuthenticationError(error);
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
};
