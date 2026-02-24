'use client';

import React, { useState } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { FlowEdge } from '@/types/flow-types';

interface EdgeListSectionProps {
  nodeId: string;
}

/**
 * Edge management section for the selected node.
 * Shows outgoing edges with condition editing, parameters, and add/remove controls.
 */
export const EdgeListSection: React.FC<EdgeListSectionProps> = ({ nodeId }) => {
  const { nodes, edges, addEdge, updateEdgeData, deleteEdge } = useFlow();
  const [addingEdge, setAddingEdge] = useState(false);

  const outgoingEdges = edges.filter((e) => e.source === nodeId);

  const getTargetDisplayId = (targetId: string): string => {
    if (targetId === nodeId) return '(self)';
    return nodes.find((n) => n.id === targetId)?.data.displayId || 'Unknown';
  };

  const handleAddEdge = (targetId: string) => {
    addEdge(nodeId, targetId);
    setAddingEdge(false);
  };

  const handleConditionChange = (edgeId: string, condition: string) => {
    updateEdgeData(edgeId, { condition });
  };

  // --- Parameter helpers (array-based to avoid key collisions) ---

  const handleParamAdd = (edge: FlowEdge) => {
    const params = [...(edge.data?.parameters || [])];
    params.push({ key: '', value: '' });
    updateEdgeData(edge.id, { parameters: params });
  };

  const handleParamRemove = (edge: FlowEdge, idx: number) => {
    const params = [...(edge.data?.parameters || [])];
    params.splice(idx, 1);
    updateEdgeData(edge.id, { parameters: params.length > 0 ? params : undefined });
  };

  const handleParamKeyChange = (edge: FlowEdge, idx: number, newKey: string) => {
    const params = [...(edge.data?.parameters || [])];
    params[idx] = { ...params[idx], key: newKey };
    updateEdgeData(edge.id, { parameters: params });
  };

  const handleParamValueChange = (edge: FlowEdge, idx: number, newValue: string) => {
    const params = [...(edge.data?.parameters || [])];
    params[idx] = { ...params[idx], value: newValue };
    updateEdgeData(edge.id, { parameters: params });
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Outgoing Edges ({outgoingEdges.length})
        </h3>
        <button
          type="button"
          onClick={() => setAddingEdge(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          + Add
        </button>
      </div>

      {/* Add edge dropdown */}
      {addingEdge && (
        <div className="flex gap-2 items-center">
          <select
            className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 bg-white"
            defaultValue=""
            onChange={(e) => e.target.value && handleAddEdge(e.target.value)}
          >
            <option value="" disabled>
              Select target node...
            </option>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.data.displayId}{n.id === nodeId ? ' (self)' : ''}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAddingEdge(false)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Empty state */}
      {outgoingEdges.length === 0 && !addingEdge && (
        <p className="text-xs text-gray-400 italic">No outgoing edges</p>
      )}

      {/* Edge list */}
      {outgoingEdges.map((edge) => {
        const params = edge.data?.parameters || [];

        return (
          <div key={edge.id} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-white">
            {/* Target + delete */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 truncate">
                &rarr; {getTargetDisplayId(edge.target)}
              </span>
              <button
                type="button"
                onClick={() => deleteEdge(edge.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete edge"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Condition input */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Condition</label>
              <input
                type="text"
                value={edge.data?.condition || ''}
                onChange={(e) => handleConditionChange(edge.id, e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., user responds positively"
              />
            </div>

            {/* Parameters */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">Parameters</label>
                <button
                  type="button"
                  onClick={() => handleParamAdd(edge)}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  + Add
                </button>
              </div>
              {params.length === 0 && (
                <p className="text-xs text-gray-300 italic">None</p>
              )}
              {params.map((param, idx) => (
                <div key={idx} className="flex gap-1 mb-1">
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => handleParamKeyChange(edge, idx, e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 rounded"
                    placeholder="key"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => handleParamValueChange(edge, idx, e.target.value)}
                    className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-200 rounded"
                    placeholder="value"
                  />
                  <button
                    type="button"
                    onClick={() => handleParamRemove(edge, idx)}
                    className="text-gray-400 hover:text-red-500 px-1 flex-shrink-0"
                    aria-label="Remove parameter"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
