import { V3 as paseto, errors } from "paseto";
import { getConstant } from "../constant";
import { match, P } from "ts-pattern";
import { logErrorMessage } from "../error";
import { DateISO } from "~/common/types";

type PesatoErrors = errors.PasetoClaimInvalid | errors.PasetoInvalid | errors.PasetoNotSupported | errors.PasetoDecryptionFailed | errors.PasetoVerificationFailed | errors.PasetoNotSupported;

const handlePesatoError = (error: PesatoErrors): void => {
  match(error)
    .with(P.instanceOf(errors.PasetoClaimInvalid), logErrorMessage("PasetoClaimInvalid"))
    .with(P.instanceOf(errors.PasetoInvalid), logErrorMessage("PasetoInvalid"))
    .with(P.instanceOf(errors.PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .with(P.instanceOf(errors.PasetoDecryptionFailed), logErrorMessage("PasetoDecryptionFailed"))
    .with(P.instanceOf(errors.PasetoVerificationFailed), logErrorMessage("PasetoVerificationFailed"))
    .with(P.instanceOf(errors.PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .otherwise(logErrorMessage("Unknown Paseto error"));
};

type ExpiresIn = `${number} ${"s" | "m" | "h" | "d"}`;
type PayloadWithIatAndExp<T> = T & { iat: DateISO; exp: DateISO; };

export const encrypt = async <T extends Record<PropertyKey, unknown>>(payload: T, expiresIn?: ExpiresIn): Promise<string> => {
  return paseto.encrypt(payload, getConstant("TOKEN_PRIVATE_KEY"), { expiresIn });
};

export const decrypt = async <T>(token: string, validate: (data: unknown) => data is T): Promise<PayloadWithIatAndExp<T> | null> => {
  return paseto.decrypt(token, getConstant("TOKEN_PRIVATE_KEY")).catch((error: PesatoErrors) => {
    handlePesatoError(error);
    return null;
  }).then((payload) => payload && validate(payload) ? payload as PayloadWithIatAndExp<T> : null);
};
