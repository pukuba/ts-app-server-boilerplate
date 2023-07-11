import { Resolvers } from "~/graphql/__generated__";
import { encodeBase64 } from "~/common";
import { getNodeFromTypeName } from "~/graphql/utils/node";

export const Node: Resolvers["Node"] = {
  id: (parent, args, context, info) => {
    const type = info.path.typename!;
    const id = parent.id;
    return encodeBase64(JSON.stringify({ type, id }));
  },
  __resolveType: (parent) => {
    return getNodeFromTypeName(parent);
  },
};
