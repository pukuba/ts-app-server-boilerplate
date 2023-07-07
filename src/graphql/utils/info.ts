import { GraphQLResolveInfo } from "graphql";

export const stackFromResolveInfo = (info: GraphQLResolveInfo): string[] => {
  const recurse = (info: GraphQLResolveInfo["path"]): string[] => {
    if(info?.prev) {
      const prevKey = recurse(info.prev);
      return prevKey !== undefined ? [...prevKey, info.key.toString()] : [info.key.toString()];
    }
    return info.typename ? [info.key.toString(), info.typename] : [info.key.toString()];
  };
  return recurse(info.path);
};
