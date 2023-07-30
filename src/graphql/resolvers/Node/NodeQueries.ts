import { Resolvers } from "~/graphql/__generated__";
import { decodeNodeId } from "~/graphql/utils/node";
import { match } from "ts-pattern";

export const NodeQueries: Resolvers["Query"] = {
  node: async (parent, args, context) => {
    const { id } = args;
    const nodeMeta = decodeNodeId(id);
    if (!nodeMeta) {
      return null;
    }
    const { type, id: externalId } = nodeMeta;
    const node = await match(type)
      .with("User", async () => context.prisma.user.findUnique({ where: { id: externalId } }))
      .otherwise(() => null);
    return node ? { ...node, __typename: type } : null;
  },
};
