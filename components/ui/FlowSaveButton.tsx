'use client';

import React, { useState } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { validateFlow } from '@/lib/flow-validation-rules';

/**
 * Save button component with flow validation
 * Shows error message if validation fails
 */
export const FlowSaveButton: React.FC = () => {
  const { nodes, edges } = useFlow();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setErrorMessage(null);
    setShowSuccess(false);

    const validation = validateFlow(nodes, edges);

    if (!validation.isValid) {
      setErrorMessage(validation.errorMessage || 'Cannot save Flow');
      return;
    }

    // Show success state
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
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
        {showSuccess ? 'Saved!' : 'Save Changes'}
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