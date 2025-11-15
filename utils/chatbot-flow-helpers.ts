import { FlowNode, FlowEdge } from '@/types/chatbot-flow-types';

/**
 * Gets all nodes that have no incoming edges (empty target handles)
 */
export const getNodesWithEmptyTargetHandles = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): FlowNode[] => {
  // Get all target node IDs from edges
  const targetNodeIds = new Set(edges.map((edge) => edge.target));

  // Return nodes that are not targets of any edge
  return nodes.filter((node) => !targetNodeIds.has(node.id));
};

/**
 * Checks if a source handle already has a connection
 */
export const hasSourceConnection = (
  nodeId: string,
  edges: FlowEdge[]
): boolean => {
  return edges.some((edge) => edge.source === nodeId);
};