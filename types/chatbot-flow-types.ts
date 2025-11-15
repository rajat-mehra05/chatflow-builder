import { Node, Edge } from 'reactflow';

/**
 * Node type enum for chatbot flow builder
 * Extensible for future node types
 */
export enum ChatbotNodeType {
  TEXT_MESSAGE = 'textMessage',
  BUTTON = 'button',
}

/**
 * Data structure for Text Message nodes
 */
export interface TextNodeData {
  text: string;
}

/**
 * Data structure for Button nodes
 */
export interface ButtonNodeData {
  buttonText: string;
  buttonValue: string;
}

/**
 * Union type for all node data types
 * Extend this when adding new node types
 */
export type ChatbotNodeData = TextNodeData | ButtonNodeData;

/**
 * Flow node extending React Flow's Node with typed data
 */
export interface FlowNode extends Node<ChatbotNodeData> {
  type: ChatbotNodeType;
}

/**
 * Flow edge type (using React Flow's Edge)
 */
export type FlowEdge = Edge;

/**
 * Complete flow state for persistence
 */
export interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
}