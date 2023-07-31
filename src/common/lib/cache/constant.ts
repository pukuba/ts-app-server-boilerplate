/**
 * @param objectId
 * @returns `rt:${objectId}`
 */
export const REFRESH_TOKEN_KEY = (objectId: string) => `rt:${objectId}` as const;

/**
 * @param token
 * @returns `bt:${token}`
 */
export const BLACKLIST_TOKEN_KEY = (token: string) => `bt:${token}` as const;
