import { Resolvers } from "~/graphql/__generated__";

export const User: Resolvers["User"] = {
  externalId: (parent) => parent.id,
};
