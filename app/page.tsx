'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { FlowProvider, useFlow } from '@/components/providers/FlowProvider';
import { FlowCanvas } from '@/components/flow/FlowCanvas';
import { AvailableNodesPanel } from '@/components/sidebar-panels/AvailableNodesPanel';
import { NodeSettingsPanel } from '@/components/sidebar-panels/NodeSettingsPanel';
import { FlowSaveButton } from '@/components/ui/FlowSaveButton';
import { RestoreFlowButton } from '@/components/ui/RestoreFlowButton';
import { JsonPreviewPanel } from '@/components/panels/JsonPreviewPanel';
import { useFlowValidation } from '@/hooks/useFlowValidation';

/**
 * Flow-level validation banner.
 * Shows flow errors (no start node, etc.) as a persistent warning strip.
 */
const ValidationBanner: React.FC = () => {
  const { nodes, edges } = useFlow();
  const { flowErrors } = useFlowValidation(nodes, edges);

  if (flowErrors.length === 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500 flex-shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
      </svg>
      <span className="text-sm text-amber-800">
        {flowErrors.join(' · ')}
      </span>
    </div>
  );
};

/**
 * Main content component that uses the flow context.
 */
const FlowBuilderContent: React.FC = () => {
  const { selectedNode } = useFlow();

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <h1 className="text-lg font-bold text-gray-800 mr-auto">Flow Builder</h1>
        <RestoreFlowButton />
        <FlowSaveButton />
      </header>

      <ValidationBanner />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative h-full">
          <FlowCanvas />
        </div>
        <aside className="w-80 border-l border-gray-200 bg-white overflow-hidden flex-shrink-0">
          {selectedNode ? <NodeSettingsPanel /> : <AvailableNodesPanel />}
        </aside>
        <JsonPreviewPanel />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowProvider>
        <FlowBuilderContent />
      </FlowProvider>
    </ReactFlowProvider>
  );
}
