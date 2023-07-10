import { Resolvers } from "~/graphql/__generated__";
import { encodeBase64 } from "~/common";
import { Prisma } from "~/services/__generated__/prisma";
import { NodeResolveType } from "~/graphql/types";

const getTypeName = <T extends object>(parent: T): NodeResolveType => {
  const resolveType = [{ ...Prisma.UserScalarFieldEnum, __typename: "User" } as const].find((type) => {
    const { __typename, ...fields } = type;
    return Object.keys(fields).every((field) => {
      return parent.hasOwnProperty(field);
    });
  });
  if (!resolveType) {
    throw new Error("Failed to resolve type");
  }
  return resolveType.__typename;
};

export const Node: Resolvers["Node"] = {
  id: (parent, args, context, info) => {
    const type = info.path.typename!;
    const id = parent.id;
    return encodeBase64(JSON.stringify({ type, id }));
  },
  __resolveType: (parent) => {
    return getTypeName(parent);
  },
};
