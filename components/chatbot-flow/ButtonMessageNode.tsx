'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ButtonNodeData } from '@/types/chatbot-flow-types';
import { useChatbotFlow } from '@/components/providers/ChatbotFlowProvider';

/**
 * Custom Button Message Node component
 * Displays a button node with purple/blue header
 */
export const ButtonMessageNode: React.FC<NodeProps<ButtonNodeData>> = ({
  id,
  data,
  selected,
}) => {
  const { selectNode } = useChatbotFlow();

  const handleClick = () => {
    selectNode(id);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 min-w-[200px] cursor-pointer ${
        selected ? 'border-blue-500' : 'border-gray-200'
      }`}
      onClick={handleClick}
    >
      {/* Header with purple/blue background */}
      <div className="bg-purple-500 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
          <span className="font-semibold text-sm">Button</span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Content area */}
      <div className="px-4 py-3 space-y-1">
        <p className="text-sm text-gray-700 font-medium">
          {data.buttonText || 'Button text'}
        </p>
        {data.buttonValue && (
          <p className="text-xs text-gray-500">Value: {data.buttonValue}</p>
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