import {
  FlowState,
  FlowNode,
  FlowNodeData,
  FlowEdge,
  PersistedFlowState,
  CURRENT_SCHEMA_VERSION,
  FLOW_NODE_TYPE,
} from '@/types/flow-types';

const STORAGE_KEY = 'chatflow-builder-flow';

/**
 * Migrates v1 (no schemaVersion) data to v2 format.
 * Converts old TextNodeData/ButtonNodeData nodes into unified FlowNodeData.
 */
const migrateV1toV2 = (raw: Record<string, unknown>): PersistedFlowState => {
  const oldNodes = (raw.nodes as Array<Record<string, unknown>>) || [];
  const oldEdges = (raw.edges as FlowEdge[]) || [];

  const migratedNodes: FlowNode[] = oldNodes.map((oldNode, index) => {
    const oldData = (oldNode.data || {}) as Record<string, string>;
    const description = oldData.text || oldData.buttonText || '';

    const data: FlowNodeData = {
      displayId: `node_${index + 1}`,
      description,
      prompt: oldData.buttonValue || '',
      isStart: index === 0,
    };

    return {
      id: oldNode.id as string,
      type: FLOW_NODE_TYPE,
      position: oldNode.position as { x: number; y: number },
      data,
    };
  });

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    nodes: migratedNodes,
    edges: oldEdges,
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

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null;
    }

    // No schemaVersion => legacy v1 data, migrate
    if (!parsed.schemaVersion) {
      const migrated = migrateV1toV2(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return { nodes: migrated.nodes, edges: migrated.edges };
    }

    // Future version — don't corrupt forward-versioned data
    if (parsed.schemaVersion > CURRENT_SCHEMA_VERSION) {
      console.warn('Flow data is from a newer version. Ignoring to avoid corruption.');
      return null;
    }

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
