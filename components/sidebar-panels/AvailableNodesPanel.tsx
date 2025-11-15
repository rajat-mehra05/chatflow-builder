'use client';

import React from 'react';
import { ChatbotNodeType } from '@/types/chatbot-flow-types';

/**
 * Available nodes panel component
 * Displays draggable node cards that can be added to the flow
 */
export const AvailableNodesPanel: React.FC = () => {

  const onDragStart = (
    event: React.DragEvent,
    nodeType: ChatbotNodeType
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Nodes Panel
      </h2>
      
      <div className="space-y-3">
        {/* Message Node Card */}
        <div
          draggable={true}
          onDragStart={(e) => onDragStart(e, ChatbotNodeType.TEXT_MESSAGE)}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-blue-600"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Message</span>
          </div>
        </div>

        {/* Button Node Card */}
        <div
          draggable={true}
          onDragStart={(e) => onDragStart(e, ChatbotNodeType.BUTTON)}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-purple-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6v6H9z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Button</span>
          </div>
        </div>
      </div>
    </div>
  );
};