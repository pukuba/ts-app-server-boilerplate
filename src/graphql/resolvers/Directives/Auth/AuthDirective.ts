import type { MemoizedFunction } from "lodash";

import { AuthenticationErrorCase, DirectiveResolvers } from "~/graphql/__generated__";
import { PrismaService, RedisService } from "~/services";
import { memoize, identity } from "lodash";
import { decrypt, PasetoClaimInvalid, PasetoDecryptionFailed, PasetoError, PasetoInvalid, PasetoNotSupported, PasetoVerificationFailed, PayloadWithIatAndExp } from "~/common";
import { User } from "~/services/__generated__/prisma";
import { P, match } from "ts-pattern";
import { AuthTokenPayload, validateAuthTokenPayload } from "~/entity";
import { BLACKLIST_TOKEN_KEY } from "~/common/lib/cache";
import { FastifyRequest } from "fastify";
import { createAuthenticationError } from "~/graphql/utils";

const isAuthenticationError = (data: unknown): data is AuthenticationErrorCase => Object.values(AuthenticationErrorCase).some((value) => value === data);

type TokenPayload = PayloadWithIatAndExp<AuthTokenPayload>;

export const getUserByContext = (redis: RedisService, prismaService: PrismaService, request: FastifyRequest): (() => Promise<readonly [AuthenticationErrorCase, null] | readonly [null, User & {
  authToken: string;
  tokenPayload: TokenPayload;
 }]>) & MemoizedFunction => {
  const authTokenHeaders = request.headers["auth-token"];
  const token = Array.isArray(authTokenHeaders) ? authTokenHeaders?.[0] : authTokenHeaders;
  return memoize(async () => {
    if (!token) {
      return [AuthenticationErrorCase.MissingAuthToken, null] as const;
    }
    const tokenPayload = await decrypt<AuthTokenPayload>(token, validateAuthTokenPayload).catch().then((payload) => {
      return match(payload)
        .with(P.instanceOf(PasetoClaimInvalid), () => AuthenticationErrorCase.Expired)
        .with(P.union(
          P.instanceOf(PasetoInvalid),
          P.instanceOf(PasetoVerificationFailed),
        ), () => AuthenticationErrorCase.InvalidToken)
        .with(P.union(
          P.instanceOf(PasetoNotSupported),
          P.instanceOf(PasetoDecryptionFailed),
          P.instanceOf(PasetoNotSupported),
          P.instanceOf(PasetoError),
          P.instanceOf(Error),
        ), () => AuthenticationErrorCase.Unknown)
        .otherwise(identity<TokenPayload>);
    });

    if (isAuthenticationError(tokenPayload)) {
      return [tokenPayload, null] as const;
    }

    const isBlacklistToken = await redis.get(BLACKLIST_TOKEN_KEY(token)).then((resp) => resp !== null);
    if (isBlacklistToken) {
      return [AuthenticationErrorCase.BlacklistedToken, null] as const;
    }

    const user = await prismaService.user.findUnique({ where: { id: tokenPayload.id } });

    if (!user) {
      return [AuthenticationErrorCase.NonExistentUser, null] as const;
    }

    return [null, { ...user, authToken: token, tokenPayload }] as const;
  });
};

export const authDirective: DirectiveResolvers["auth"] = async (next, source, args, context) => {
  const [error, viewer] = await context.viewer();
  if (isAuthenticationError(error)) {
    return createAuthenticationError(error);
  } else if (error || !viewer) {
    return createAuthenticationError(AuthenticationErrorCase.Unknown);
  }
  return next();
};
