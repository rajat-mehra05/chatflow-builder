import {
  FlowState,
  FlowNode,
  FlowNodeData,
  FlowEdge,
  PersistedFlowState,
  CURRENT_SCHEMA_VERSION,
  FLOW_NODE_TYPE,
  FLOW_EDGE_TYPE,
} from '@/types/flow-types';

const STORAGE_KEY = 'chatflow-builder-flow';

/**
 * Migrates v1 (no schemaVersion) data to v2 format.
 * Converts old TextNodeData/ButtonNodeData nodes into unified FlowNodeData.
 */
const migrateV1toV2 = (raw: Record<string, unknown>): PersistedFlowState => {
  const oldNodes = (raw.nodes as Array<Record<string, unknown>>) || [];
  const oldEdges = (raw.edges as FlowEdge[]) || [];

  // Determine start node: explicit marker > node with no incoming edges > first node
  const incomingTargets = new Set(oldEdges.map((e) => e.target));
  const startNodeId =
    oldNodes.find((n) => (n.data as Record<string, unknown>)?.isStart)?.id ??
    oldNodes.find((n) => !incomingTargets.has(n.id as string))?.id ??
    oldNodes[0]?.id;

  const migratedNodes: FlowNode[] = oldNodes.map((oldNode, index) => {
    const oldData = (oldNode.data || {}) as Record<string, string>;
    const description = oldData.text || oldData.buttonText || '';

    const data: FlowNodeData = {
      displayId: `node_${index + 1}`,
      description,
      prompt: oldData.buttonValue || '',
      isStart: oldNode.id === startNodeId,
    };

    return {
      id: oldNode.id as string,
      type: FLOW_NODE_TYPE,
      position: oldNode.position as { x: number; y: number },
      data,
    };
  });

  return {
    schemaVersion: 2,
    nodes: migratedNodes,
    edges: oldEdges,
  };
};

/**
 * Migrates v2 data to v3 format.
 * Adds type and data (condition, parameters) to edges.
 */
const migrateV2toV3 = (parsed: PersistedFlowState): PersistedFlowState => {
  const edges: FlowEdge[] = (parsed.edges as Array<Record<string, unknown>>).map((edge) => ({
    ...edge,
    type: FLOW_EDGE_TYPE,
    data: {
      condition: (edge.label as string) || '',
    },
  })) as FlowEdge[];

  return {
    schemaVersion: 3,
    nodes: parsed.nodes,
    edges,
  };
};

export const saveFlowToStorage = (flowState: FlowState): void => {
  if (typeof window === 'undefined') return;
  try {
    const persisted: PersistedFlowState = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      ...flowState,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch (error) {
    console.error('Failed to save flow to localStorage:', error);
  }
};

export const loadFlowFromStorage = (): FlowState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    let parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null;
    }

    // Migration chain: v1 → v2 → v3
    if (!parsed.schemaVersion) {
      parsed = migrateV1toV2(parsed);
    }
    if (parsed.schemaVersion === 2) {
      parsed = migrateV2toV3(parsed);
    }

    // Future version — don't corrupt forward-versioned data
    if (parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
      console.warn('Flow data is from a newer version. Ignoring to avoid corruption.');
      return null;
    }

    // Persist migrated data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    return { nodes: parsed.nodes, edges: parsed.edges };
  } catch (error) {
    console.error('Failed to load flow from localStorage:', error);
    return null;
  }
};

export const clearFlowStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear flow from localStorage:', error);
  }
};
