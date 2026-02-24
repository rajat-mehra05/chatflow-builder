import { XYPosition } from 'reactflow';
import { FLOW_NODE_TYPE, FlowNode } from '@/types/flow-types';

/**
 * Generates a default user-facing displayId.
 * Short, readable, and immediately editable by the user.
 */
const generateDefaultDisplayId = (): string => {
  return `node_${Date.now().toString(36)}`;
};

/**
 * Creates a new flow node at the specified canvas position.
 * Uses crypto.randomUUID() for the internal React Flow ID (never exposed to users).
 */
export const createFlowNode = (position: XYPosition): FlowNode => {
  return {
    id: crypto.randomUUID(),
    type: FLOW_NODE_TYPE,
    position,
    data: {
      displayId: generateDefaultDisplayId(),
      description: '',
      prompt: '',
      isStart: false,
    },
  };
};
