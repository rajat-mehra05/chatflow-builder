'use client';

import React from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { EdgeListSection } from './EdgeListSection';

/**
 * Node settings panel.
 * Edits displayId, description, prompt, and isStart for the selected node.
 * Reads directly from derived selectedNode (always fresh, no local state needed).
 */
export const NodeSettingsPanel: React.FC = () => {
  const { selectedNode, updateNodeData, selectNode, setStartNode } = useFlow();

  if (!selectedNode) return null;

  const { displayId, description, prompt, isStart } = selectedNode.data;

  const handleChange = (field: 'displayId' | 'description' | 'prompt', value: string) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  const handleStartToggle = () => {
    if (!isStart) {
      setStartNode(selectedNode.id);
    } else {
      updateNodeData(selectedNode.id, { isStart: false });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => selectNode(null)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Node Settings</h2>
        </div>
      </div>

      {/* Fields */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Display ID */}
        <div>
          <label htmlFor="node-display-id" className="block text-sm font-medium text-gray-700 mb-1">
            Node ID
          </label>
          <input
            id="node-display-id"
            type="text"
            value={displayId}
            onChange={(e) => handleChange('displayId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Unique node identifier..."
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="node-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="node-description"
            value={description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
            placeholder="What does this node do..."
          />
        </div>

        {/* Prompt */}
        <div>
          <label htmlFor="node-prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Prompt
          </label>
          <textarea
            id="node-prompt"
            value={prompt}
            onChange={(e) => handleChange('prompt', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={5}
            placeholder="Enter the prompt for this node..."
          />
        </div>

        {/* Start Node Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Start Node</label>
            <p className="text-xs text-gray-400">Only one node can be the start</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-label="Start node"
            aria-checked={isStart}
            onClick={handleStartToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isStart ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isStart ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Outgoing Edges */}
        <EdgeListSection nodeId={selectedNode.id} />
      </div>
    </div>
  );
};
