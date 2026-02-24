'use client';

import React, { useState } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { useFlowValidation } from '@/hooks/useFlowValidation';
import { flowToSchema } from '@/utils/flow-to-schema';

/**
 * Export button with validation gating.
 * Blocks export when blocking errors exist, shows error details.
 */
export const FlowSaveButton: React.FC = () => {
  const { nodes, edges } = useFlow();
  const { hasBlockingErrors, flowErrors, nodeWarnings } = useFlowValidation(nodes, edges);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setErrorMessage(null);
    setShowSuccess(false);

    if (hasBlockingErrors) {
      const errors: string[] = [...flowErrors];
      for (const [, msgs] of nodeWarnings) {
        for (const msg of msgs) {
          if (!errors.includes(msg)) errors.push(msg);
        }
      }
      setErrorMessage(errors.slice(0, 3).join(', '));
      return;
    }

    // Export the schema as JSON download
    const schema = flowToSchema(nodes, edges);
    const json = JSON.stringify(schema, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.json';
    a.click();
    URL.revokeObjectURL(url);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleSave}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          showSuccess
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {showSuccess ? 'Exported!' : 'Export JSON'}
      </button>

      {/* Error message */}
      {errorMessage && (
        <div className="absolute top-full left-0 mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg shadow-lg z-50 whitespace-nowrap">
          {errorMessage}
        </div>
      )}
    </div>
  );
};