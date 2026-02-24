import { NodeTypes } from 'reactflow';
import { FLOW_NODE_TYPE } from '@/types/flow-types';
import { FlowNodeMemo } from './FlowNode';

/**
 * Node type registry for React Flow.
 * Single entry: all nodes use the same FlowNode component.
 */
export const flowNodeTypes: NodeTypes = {
  [FLOW_NODE_TYPE]: FlowNodeMemo,
};
