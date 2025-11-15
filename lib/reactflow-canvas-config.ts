import { DefaultEdgeOptions, MarkerType } from 'reactflow';

/**
 * Default edge options for React Flow
 */
export const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: false,
  style: { stroke: '#94a3b8', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#94a3b8',
  },
};

/**
 * Default viewport settings
 */
export const defaultViewport = {
  x: 0,
  y: 0,
  zoom: 1,
};