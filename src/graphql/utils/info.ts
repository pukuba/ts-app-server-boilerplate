import { GraphQLResolveInfo } from "graphql";

export const getPathFromResolveInfo = (info: GraphQLResolveInfo): string[] => {
  const getPathKeys = (info: GraphQLResolveInfo["path"]): string[] => {
    if (info?.prev) {
      const prevKey = getPathKeys(info.prev);
      return prevKey !== undefined ? [...prevKey, info.key.toString()] : [info.key.toString()];
    }
    return info.typename ? [info.key.toString(), info.typename] : [info.key.toString()];
  };
  return getPathKeys(info.path);
};
