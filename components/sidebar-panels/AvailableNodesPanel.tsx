'use client';

import React from 'react';
import { FLOW_NODE_TYPE } from '@/types/flow-types';

/**
 * Panel displaying the draggable node card for adding to the canvas.
 */
export const AvailableNodesPanel: React.FC = () => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', FLOW_NODE_TYPE);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Nodes</h2>

      <div className="space-y-3">
        <div
          draggable
          onDragStart={onDragStart}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-indigo-600"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Flow Node</span>
            <span className="text-xs text-gray-400">Drag to canvas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
