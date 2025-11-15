'use client';

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { TextNodeData } from '@/types/chatbot-flow-types';
import { useChatbotFlow } from '@/components/providers/ChatbotFlowProvider';

/**
 * Custom Text Message Node component
 * Displays a text message node with teal header
 */
export const TextMessageNode: React.FC<NodeProps<TextNodeData>> = ({
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
      {/* Header with teal background */}
      <div className="bg-teal-500 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="font-semibold text-sm">Send Message</span>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Content area */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-700 break-words">
          {data.text || 'Empty message'}
        </p>
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