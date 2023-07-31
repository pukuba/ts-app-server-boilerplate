import { DirectiveResolvers } from "~/graphql/__generated__";
import { authDirective } from "./Auth";
import { defaultFieldResolver, GraphQLResolveInfo, GraphQLSchema } from "graphql";

import { getDirectives, MapperKind, mapSchema } from "@graphql-tools/utils";
import { MercuriusContext } from "~/graphql/types";

export const directivesResolvers: DirectiveResolvers = {
  auth: authDirective,
};

export function attachDirectiveResolvers (schema: GraphQLSchema, directiveResolvers: DirectiveResolvers): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const newFieldConfig = { ...fieldConfig };

      const directives = getDirectives(schema, fieldConfig);
      for (const directive of directives) {
        const directiveName = directive.name as keyof typeof directiveResolvers;
        if (directiveResolvers[directiveName]) {
          const resolver = directiveResolvers[directiveName];

          if (!resolver) {
            throw new Error(`Directive ${directiveName} resolver unimplemented`);
          }

          const originalResolver = newFieldConfig.resolve != null ? newFieldConfig.resolve : defaultFieldResolver;
          const directiveArgs = directive.args;
          newFieldConfig.resolve = (source: unknown, originalArgs: unknown, context: MercuriusContext, info: GraphQLResolveInfo): typeof resolver => {
            return resolver(
              () =>
                new Promise((resolve, reject) => {
                  const result = originalResolver(source, originalArgs, context, info);
                  if (result instanceof Error) {
                    reject(result);
                  }
                  resolve(result);
                }),
              source,
              directiveArgs as Record<PropertyKey, unknown>,
              context,
              info,
            );
          };
        }
      }

      return newFieldConfig;
    },
  });
}
