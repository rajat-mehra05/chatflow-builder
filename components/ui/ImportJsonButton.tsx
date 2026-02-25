'use client';

import React, { useState, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useFlow } from '@/components/providers/FlowProvider';
import { validateImportSchema, schemaToFlow } from '@/utils/schema-to-flow';
import { FlowSchema } from '@/utils/flow-to-schema';

/**
 * Import JSON button with modal.
 * Allows pasting or uploading a JSON file to replace the current flow.
 */
export const ImportJsonButton: React.FC = () => {
  const { setNodes, setEdges, selectNode } = useFlow();
  const { fitView } = useReactFlow();

  const [showModal, setShowModal] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setJsonText('');
    setErrors([]);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setJsonText('');
    setErrors([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        setJsonText(text);
        setErrors([]);
      }
    };
    reader.readAsText(file);

    // Reset so re-selecting the same file triggers change
    e.target.value = '';
  };

  const handleImport = () => {
    // Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      setErrors([`Invalid JSON: ${(err as Error).message}`]);
      return;
    }

    // Validate schema
    const validationErrors = validateImportSchema(parsed);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Convert to flow
    const result = schemaToFlow(parsed as FlowSchema);

    // Replace current flow
    selectNode(null);
    setNodes(result.nodes);
    setEdges(result.edges);

    // Fit view after React Flow processes new nodes
    setTimeout(() => fitView({ padding: 0.2 }), 50);

    handleClose();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-xs px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        title="Import JSON"
      >
        Import
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Import JSON
            </h3>
            <p className="text-sm text-amber-700 mb-4">
              This will replace your current flow.
            </p>

            {/* Textarea */}
            <textarea
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value);
                setErrors([]);
              }}
              placeholder='Paste your flow JSON here...'
              className="flex-1 min-h-[200px] w-full px-3 py-2 text-sm font-mono border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              spellCheck={false}
            />

            {/* File upload */}
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                or upload a .json file
              </button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg max-h-32 overflow-auto">
                <p className="text-xs font-medium text-red-800 mb-1">
                  Validation errors:
                </p>
                <ul className="text-xs text-red-700 list-disc list-inside space-y-0.5">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!jsonText.trim()}
                className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Import & Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
