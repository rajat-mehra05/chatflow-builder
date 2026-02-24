'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FlowNodeData } from '@/types/flow-types';

/**
 * Visual flow node component.
 * Renders displayId, description preview, prompt preview, and start indicator.
 * Pure component — no context dependency. Canvas handles selection via onNodeClick.
 */
const FlowNodeComponent: React.FC<NodeProps<FlowNodeData>> = ({
  data,
  selected,
}) => {
  const { displayId, description, prompt, isStart, _warnings } = data;
  const hasWarnings = _warnings && _warnings.length > 0;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[220px] max-w-[280px] relative ${
        selected
          ? 'border-blue-500'
          : hasWarnings
            ? 'border-amber-400'
            : 'border-gray-200'
      }`}
    >
      {/* Warning badge */}
      {hasWarnings && (
        <div
          className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
          title={_warnings?.join('\n') ?? ''}
        >
          !
        </div>
      )}
      {/* Header: amber for start node, indigo for regular */}
      <div
        className={`${
          isStart ? 'bg-amber-500' : 'bg-indigo-500'
        } text-white px-4 py-2 rounded-t-lg flex items-center gap-2`}
      >
        {isStart && (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        <span className="font-semibold text-sm truncate">
          {displayId || 'Untitled'}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-1">
        <p className="text-sm text-gray-700 line-clamp-2">
          {description || 'No description'}
        </p>
        {prompt && (
          <p className="text-xs text-gray-400 truncate">{prompt}</p>
        )}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-gray-800"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-800"
      />
    </div>
  );
};

export const FlowNodeMemo = memo(FlowNodeComponent);
