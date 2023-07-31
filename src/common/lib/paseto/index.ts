import { V3 as paseto, errors } from "paseto";
import { getConstant } from "../constant";
import { match, P } from "ts-pattern";
import { logErrorMessage } from "../error";
import { DateISO } from "~/common/types";

export const { PasetoClaimInvalid, PasetoDecryptionFailed, PasetoError, PasetoInvalid, PasetoNotSupported, PasetoVerificationFailed } = errors;

type PasetoErrors = errors.PasetoClaimInvalid | errors.PasetoInvalid | errors.PasetoNotSupported | errors.PasetoDecryptionFailed | errors.PasetoVerificationFailed | errors.PasetoNotSupported | Error;

const handlePesatoError = (error: PasetoErrors): PasetoErrors => {
  return match(error)
    .with(P.instanceOf(PasetoClaimInvalid), logErrorMessage("PasetoClaimInvalid"))
    .with(P.instanceOf(PasetoInvalid), logErrorMessage("PasetoInvalid"))
    .with(P.instanceOf(PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .with(P.instanceOf(PasetoDecryptionFailed), logErrorMessage("PasetoDecryptionFailed"))
    .with(P.instanceOf(PasetoVerificationFailed), logErrorMessage("PasetoVerificationFailed"))
    .with(P.instanceOf(PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .with(P.instanceOf(PasetoError), logErrorMessage("PasstoError"))
    .otherwise(logErrorMessage("Unknown Paseto error"));
};

type ExpiresIn = `${number} ${"s" | "m" | "h" | "d"}`;
type PayloadWithIatAndExp<T> = T & { iat: DateISO; exp: DateISO; };

export const encrypt = async <T extends Record<PropertyKey, unknown>>(payload: T, expiresIn?: ExpiresIn): Promise<string> => {
  return paseto.encrypt(payload, getConstant("TOKEN_PRIVATE_KEY"), { expiresIn });
};

export const decrypt = async <T>(token: string, validate: (data: unknown) => data is T): Promise<PayloadWithIatAndExp<T> | PasetoErrors> => {
  return paseto.decrypt(token, getConstant("TOKEN_PRIVATE_KEY"))
    .catch((error: PasetoErrors) => handlePesatoError(error))
    .then((resp: unknown) => resp && validate(resp) ? resp as PayloadWithIatAndExp<T> : resp as PasetoErrors);
};
