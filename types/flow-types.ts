import { Node, Edge } from 'reactflow';

/**
 * Single node type identifier.
 * With a unified node model, no enum is needed.
 */
export const FLOW_NODE_TYPE = 'flowNode' as const;

/**
 * Custom edge type identifier for edges with condition labels.
 */
export const FLOW_EDGE_TYPE = 'conditionalEdge' as const;

/**
 * Data payload for all flow nodes.
 * displayId is the user-facing "id" in the exported schema.
 * node.id is the internal React Flow UUID, never shown to users.
 */
export interface FlowNodeData {
  displayId: string;
  description: string;
  prompt: string;
  isStart: boolean;
}

/**
 * Data payload for flow edges.
 * condition: the text label displayed on the edge.
 * parameters: optional key-value pairs (omitted from JSON when empty).
 * Stored as array to keep entries distinct during editing; converted to Record on export.
 */
export interface FlowEdgeData {
  condition: string;
  parameters?: Array<{ key: string; value: string }>;
}

/**
 * Flow node extending React Flow's Node with typed data.
 */
export interface FlowNode extends Node<FlowNodeData> {
  type: typeof FLOW_NODE_TYPE;
}

/**
 * Flow edge with typed data for condition and parameters.
 */
export type FlowEdge = Edge<FlowEdgeData>;

/**
 * Schema version for localStorage migration.
 * v1: old chatbot format (TextNodeData/ButtonNodeData)
 * v2: unified FlowNodeData, bare edges
 * v3: edges with type + data (condition, parameters)
 */
export const CURRENT_SCHEMA_VERSION = 3;

/**
 * Persisted flow state with schema versioning.
 */
export interface PersistedFlowState {
  schemaVersion: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Runtime flow state (no schema version needed in memory).
 */
export interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
}
