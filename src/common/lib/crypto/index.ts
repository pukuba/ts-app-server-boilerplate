import { genSalt, hash, compare } from "bcryptjs";

export const createHash = async(input: string): Promise<string> => {
  const salt = await genSalt(10);
  const hashed = await hash(input, salt);
  return hashed;
};

export const compareHash = async(input: string, hashed: string): Promise<boolean> => {
  const isMatch = await compare(input, hashed);
  return isMatch;
};

export const decodeBase64 = (input: string): string => {
  return Buffer.from(input, "base64").toString("utf-8");
};

export const decodeBase64WithJSON = <T>(input: string): T => {
  return JSON.parse(decodeBase64(input));
};

export const encodeBase64 = (input: string): string => {
  return Buffer.from(input).toString("base64");
};
