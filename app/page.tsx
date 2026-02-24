'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { FlowProvider, useFlow } from '@/components/providers/FlowProvider';
import { FlowCanvas } from '@/components/flow/FlowCanvas';
import { AvailableNodesPanel } from '@/components/sidebar-panels/AvailableNodesPanel';
import { NodeSettingsPanel } from '@/components/sidebar-panels/NodeSettingsPanel';
import { FlowSaveButton } from '@/components/ui/FlowSaveButton';
import { RestoreFlowButton } from '@/components/ui/RestoreFlowButton';

/**
 * Main content component that uses the flow context.
 */
const FlowBuilderContent: React.FC = () => {
  const { selectedNode } = useFlow();

  return (
    <div className="h-screen w-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-end items-center gap-3">
        <RestoreFlowButton />
        <FlowSaveButton />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative h-full">
          <FlowCanvas />
        </div>
        <aside className="w-80 border-l border-gray-200 bg-white overflow-hidden">
          {selectedNode ? <NodeSettingsPanel /> : <AvailableNodesPanel />}
        </aside>
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
