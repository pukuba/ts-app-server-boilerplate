/**
 * @param objectId
 * @returns `rt:${objectId}`
 */
export const REFRESH_TOKEN_KEY = (objectId: string) => `rt:${objectId}` as const;
