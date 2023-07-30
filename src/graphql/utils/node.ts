import { z } from "zod";
import { NodeResolveType } from "../types";
import { decodeBase64WithJSON, encodeBase64, logger } from "~/common";

const NodeIdSchema = z.object({
  type: z.string(),
  id: z.string(),
});

export type NodeMetaData = {
  type: NodeResolveType;
  id: string;
};

const isNodeMetaData = (input: unknown): input is NodeMetaData => {
  const parsed = NodeIdSchema.safeParse(input);
  if (!parsed.success) {
    logger.error(parsed.error);
  }
  return parsed.success;
};

export const decodeNodeId = (id: string): NodeMetaData | null => {
  const decodedData = decodeBase64WithJSON<NodeMetaData>(id);
  return isNodeMetaData(decodedData) ? decodedData : null;
};

export const encodeNodeId = (obj: NodeMetaData): string => {
  return encodeBase64(JSON.stringify({ ...obj }));
};

export const getNodeFromTypeName = <T extends object>(parent: T & { __typename?: NodeResolveType; }): NodeResolveType => {
  if (parent.__typename) {
    return parent.__typename;
  }
  throw new Error("Failed to resolve type");
};
