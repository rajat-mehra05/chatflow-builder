'use client';

import React, { useState } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { clearFlowStorage } from '@/utils/persist-flow';

/**
 * Restore Flow button component
 * Clears all nodes and edges from the flow
 */
export const RestoreFlowButton: React.FC = () => {
  const { setNodes, setEdges, selectNode } = useFlow();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRestore = () => {
    setShowConfirm(true);
  };

  const handleConfirmRestore = () => {
    // Clear nodes and edges
    setNodes([]);
    setEdges([]);
    selectNode(null);
    clearFlowStorage();
    setShowConfirm(false);
  };

  const handleCancelRestore = () => {
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleRestore}
        className="px-6 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
      >
        Restore Flow
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Restore Flow?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              This will clear all nodes and connections. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelRestore}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

