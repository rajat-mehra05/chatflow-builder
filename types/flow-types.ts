import { Node, Edge } from 'reactflow';

/**
 * Single node type identifier.
 * With a unified node model, no enum is needed.
 */
export const FLOW_NODE_TYPE = 'flowNode' as const;

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
 * Flow node extending React Flow's Node with typed data.
 */
export interface FlowNode extends Node<FlowNodeData> {
  type: typeof FLOW_NODE_TYPE;
}

/**
 * Flow edge type (using React Flow's Edge directly).
 */
export type FlowEdge = Edge;

/**
 * Schema version for localStorage migration.
 */
export const CURRENT_SCHEMA_VERSION = 2;

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
