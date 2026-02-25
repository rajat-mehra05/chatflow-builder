import { useMemo } from 'react';
import { FlowNode, FlowEdge } from '@/types/flow-types';

export interface NodeWarning {
  nodeId: string;
  messages: string[];
}

export interface FlowValidationResult {
  /** Per-node warnings keyed by internal node ID */
  nodeWarnings: Map<string, string[]>;
  /** Flow-level errors (shown as banner) */
  flowErrors: string[];
  /** True when export should be blocked */
  hasBlockingErrors: boolean;
}

/**
 * Computes all validation errors from the current flow state.
 * Memoized on [nodes, edges] to avoid re-computation on every render.
 */
export const useFlowValidation = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): FlowValidationResult => {
  return useMemo(() => {
    const nodeWarnings = new Map<string, string[]>();
    const flowErrors: string[] = [];

    const addWarning = (nodeId: string, msg: string) => {
      const existing = nodeWarnings.get(nodeId) || [];
      existing.push(msg);
      nodeWarnings.set(nodeId, existing);
    };

    // --- Flow-level checks ---

    // No start node
    const startNodes = nodes.filter((n) => n.data.isStart);
    if (nodes.length > 0 && startNodes.length === 0) {
      flowErrors.push('No start node set');
    }

    // --- Per-node checks ---

    // Build displayId frequency map for uniqueness check
    const displayIdCounts = new Map<string, number>();
    for (const node of nodes) {
      const did = node.data.displayId.trim();
      displayIdCounts.set(did, (displayIdCounts.get(did) || 0) + 1);
    }

    // Incoming edges per node
    const incomingCount = new Map<string, number>();
    for (const edge of edges) {
      incomingCount.set(edge.target, (incomingCount.get(edge.target) || 0) + 1);
    }

    // Outgoing edges per node
    const outgoingCount = new Map<string, number>();
    for (const edge of edges) {
      outgoingCount.set(edge.source, (outgoingCount.get(edge.source) || 0) + 1);
    }

    for (const node of nodes) {
      const did = node.data.displayId.trim();

      // Empty ID
      if (!did) {
        addWarning(node.id, 'Node ID is empty');
      }

      // Duplicate ID
      if (did && (displayIdCounts.get(did) || 0) > 1) {
        addWarning(node.id, 'Duplicate node ID');
      }

      // Empty description
      if (!node.data.description.trim()) {
        addWarning(node.id, 'Description is empty');
      }

      // Connectivity checks (orphaned is superset of disconnected — mutually exclusive)
      const incoming = incomingCount.get(node.id) || 0;
      const outgoing = outgoingCount.get(node.id) || 0;

      if (incoming === 0 && outgoing === 0 && nodes.length > 1) {
        addWarning(node.id, 'Orphaned: no connections');
      } else if (!node.data.isStart && incoming === 0 && nodes.length > 1) {
        addWarning(node.id, 'Disconnected: no incoming edges');
      }
    }

    // --- Edge-level checks (attributed to source node) ---
    for (const edge of edges) {
      if (!edge.data?.condition?.trim()) {
        addWarning(edge.source, 'Edge missing condition text');
      }
    }

    // Blocking if any displayId is empty/duplicate or no start node
    const hasBlockingErrors =
      flowErrors.length > 0 ||
      [...nodeWarnings.values()].some((msgs) =>
        msgs.some(
          (m) =>
            m === 'Node ID is empty' ||
            m === 'Duplicate node ID' ||
            m === 'Description is empty'
        )
      );

    return { nodeWarnings, flowErrors, hasBlockingErrors };
  }, [nodes, edges]);
};
