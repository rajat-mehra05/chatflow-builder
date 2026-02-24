import { FlowNode, FlowEdge } from '@/types/flow-types';

export interface ValidationError {
  nodeId?: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

/**
 * Validates the entire flow. Returns an array of errors and warnings.
 * Errors block export. Warnings are informational.
 */
export const validateFlow = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (nodes.length === 0) return errors;

  // Flow-level: no start node
  if (!nodes.some((n) => n.data.isStart)) {
    errors.push({ message: 'No start node set', severity: 'error' });
  }

  // Build displayId frequency map for duplicate detection (normalized)
  const idCount = new Map<string, number>();
  for (const node of nodes) {
    const normalized = node.data.displayId.trim();
    idCount.set(normalized, (idCount.get(normalized) || 0) + 1);
  }

  // Per-node validation
  for (const node of nodes) {
    const { description } = node.data;
    const normalized = node.data.displayId.trim();

    if (!normalized) {
      errors.push({
        nodeId: node.id, field: 'displayId',
        message: 'Node ID is required', severity: 'error',
      });
    } else if ((idCount.get(normalized) || 0) > 1) {
      errors.push({
        nodeId: node.id, field: 'displayId',
        message: 'Duplicate node ID', severity: 'error',
      });
    }

    if (!description.trim()) {
      errors.push({
        nodeId: node.id, field: 'description',
        message: 'Description is required', severity: 'error',
      });
    }

    // Unreachable: not start, no incoming edges, multiple nodes exist
    const hasIncoming = edges.some((e) => e.target === node.id);
    if (!node.data.isStart && !hasIncoming && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        message: 'Unreachable node (no incoming edges)',
        severity: 'warning',
      });
    }
  }

  // Edge condition warnings
  for (const edge of edges) {
    if (!edge.data?.condition?.trim()) {
      const targetNode = nodes.find((n) => n.id === edge.target);
      errors.push({
        nodeId: edge.source,
        field: 'edge',
        message: `Edge to "${targetNode?.data.displayId || 'unknown'}" has no condition`,
        severity: 'warning',
      });
    }
  }

  return errors;
};
