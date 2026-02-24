import { EdgeTypes } from 'reactflow';
import { FLOW_EDGE_TYPE } from '@/types/flow-types';
import { ConditionalEdgeMemo } from './ConditionalEdge';

/**
 * Edge type registry for React Flow.
 * Single entry: all edges use the ConditionalEdge component.
 */
export const flowEdgeTypes: EdgeTypes = {
  [FLOW_EDGE_TYPE]: ConditionalEdgeMemo,
};
