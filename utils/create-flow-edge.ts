import { FLOW_EDGE_TYPE, FlowEdge } from '@/types/flow-types';

/**
 * Creates a new flow edge with empty condition.
 */
export const createFlowEdge = (sourceId: string, targetId: string): FlowEdge => ({
  id: crypto.randomUUID(),
  source: sourceId,
  target: targetId,
  type: FLOW_EDGE_TYPE,
  data: { condition: '' },
});

/**
 * Checks if an edge with the same source→target and empty condition already exists.
 * Used to prevent duplicate canvas-drawn connections.
 */
export const isDuplicateEdge = (
  edges: FlowEdge[],
  sourceId: string,
  targetId: string
): boolean =>
  edges.some(
    (e) => e.source === sourceId && e.target === targetId && !e.data?.condition
  );
