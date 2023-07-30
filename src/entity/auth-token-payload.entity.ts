import { z } from "zod";
import { logger } from "~/common";

const AuthTokenPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export type AuthTokenPayload = z.infer<typeof AuthTokenPayloadSchema>;

export const validateAuthTokenPayload = (data: unknown): data is AuthTokenPayload => {
  const parsed = AuthTokenPayloadSchema.safeParse(data);
  if (!parsed.success) {
    logger.error(`AuthTokenPayload validation error: ${parsed.error}`);
  }
  return parsed.success;
};
