'use client';

import React, { memo } from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';
import { FlowEdgeData } from '@/types/flow-types';

/**
 * Custom edge component that renders a condition label on the edge path.
 * Only shows the label when a non-empty condition exists.
 */
const ConditionalEdge: React.FC<EdgeProps<FlowEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const condition = data?.condition || '';

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={style} markerEnd={markerEnd} />
      {condition && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-white border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-700 shadow-sm max-w-[160px] truncate"
          >
            {condition}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const ConditionalEdgeMemo = memo(ConditionalEdge);
