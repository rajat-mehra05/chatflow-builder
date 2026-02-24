import { FlowNode, FlowEdge } from '@/types/flow-types';

/**
 * Gets all nodes that have no incoming edges (empty target handles).
 */
export const getNodesWithEmptyTargetHandles = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): FlowNode[] => {
  const targetNodeIds = new Set(edges.map((edge) => edge.target));
  return nodes.filter((node) => !targetNodeIds.has(node.id));
};

/**
 * Checks if a node has at least one outgoing connection.
 */
export const hasSourceConnection = (
  nodeId: string,
  edges: FlowEdge[]
): boolean => {
  return edges.some((edge) => edge.source === nodeId);
};
