import { Resolvers } from "../../__generated__/typings";

export const Mutation: Resolvers["Mutation"] ={
  throw: (): Error => {
    return {
      message: "Error thrown from resolver.",
      name: "Error",
    }
  },
}
