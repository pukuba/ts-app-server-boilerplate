import { V4 as paseto, errors } from "paseto";
import { getConstant } from "../constant";
import { match } from "ts-pattern";
import { instanceOf } from "ts-pattern/dist/patterns";
import { logErrorMessage } from "../error";

type PesatoErrors = errors.PasetoClaimInvalid | errors.PasetoInvalid | errors.PasetoNotSupported | errors.PasetoDecryptionFailed | errors.PasetoVerificationFailed | errors.PasetoNotSupported;

const handlePesatoError = (error: PesatoErrors): void => {
  match(error)
    .with(instanceOf(errors.PasetoClaimInvalid), logErrorMessage("PasetoClaimInvalid"))
    .with(instanceOf(errors.PasetoInvalid), logErrorMessage("PasetoInvalid"))
    .with(instanceOf(errors.PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .with(instanceOf(errors.PasetoDecryptionFailed), logErrorMessage("PasetoDecryptionFailed"))
    .with(instanceOf(errors.PasetoVerificationFailed), logErrorMessage("PasetoVerificationFailed"))
    .with(instanceOf(errors.PasetoNotSupported), logErrorMessage("PasetoNotSupported"))
    .otherwise(logErrorMessage("Unknown Paseto error"));
};

type ExpiresIn = `${number} ${"s" | "m" | "h" | "d"}`;
type PayloadWithCreation<T> = T & { createdAt: number; };

export const sign = async <T extends Record<PropertyKey, unknown>>(payload: T, expiresIn?: ExpiresIn): Promise<string> => {
  return paseto.sign({ ...payload, createdAt: new Date().getTime() }, getConstant("TOKEN_PRIVATE_KEY"), { expiresIn });
};

export const verify = async <T>(token: string, validate: (data: unknown) => data is PayloadWithCreation<T>): Promise<PayloadWithCreation<T> | null> => {
  return paseto.verify(token, getConstant("TOKEN_PRIVATE_KEY")).catch((error: PesatoErrors) => {
    handlePesatoError(error);
    return null;
  }).then((payload) => validate(payload) ? payload : null);
};
