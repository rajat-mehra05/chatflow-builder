'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { EdgeListSection } from './EdgeListSection';

/**
 * Node settings panel with per-field "touched" validation.
 * Errors show only after a field has been blurred (user interacted and left).
 */
export const NodeSettingsPanel: React.FC = () => {
  const { selectedNode, nodes, updateNodeData, selectNode, setStartNode } = useFlow();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset touched state when switching to a different node
  useEffect(() => {
    setTouched({});
  }, [selectedNode?.id]);

  const markTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  if (!selectedNode) return null;

  const { displayId, description, prompt, isStart } = selectedNode.data;

  const handleChange = (field: 'displayId' | 'description' | 'prompt', value: string) => {
    updateNodeData(selectedNode.id, { [field]: value });
  };

  // --- Validation errors (only shown for touched fields) ---
  const trimmedId = displayId.trim();
  const idEmpty = !trimmedId;
  const idDuplicate =
    !!trimmedId &&
    nodes.some((n) => n.id !== selectedNode.id && n.data.displayId.trim() === trimmedId);
  const descEmpty = !description.trim();

  const idError = touched.displayId
    ? idEmpty
      ? 'Node ID is required'
      : idDuplicate
        ? 'This ID is already used by another node'
        : null
    : null;

  const descError = touched.description && descEmpty ? 'Description is required' : null;

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
            onBlur={() => markTouched('displayId')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 ${
              idError
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Unique node identifier..."
          />
          {idError && (
            <p className="mt-1 text-xs text-red-600">{idError}</p>
          )}
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
            onBlur={() => markTouched('description')}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500 resize-none ${
              descError
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={3}
            placeholder="What does this node do..."
          />
          {descError && (
            <p className="mt-1 text-xs text-red-600">{descError}</p>
          )}
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
