'use client';

import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ChatbotFlowProvider } from '@/components/providers/ChatbotFlowProvider';
import { ChatbotFlowCanvas } from '@/components/chatbot-flow/ChatbotFlowCanvas';
import { AvailableNodesPanel } from '@/components/sidebar-panels/AvailableNodesPanel';
import { NodeSettingsPanel } from '@/components/sidebar-panels/NodeSettingsPanel';
import { FlowSaveButton } from '@/components/ui/FlowSaveButton';
import { RestoreFlowButton } from '@/components/ui/RestoreFlowButton';
import { useChatbotFlow } from '@/components/providers/ChatbotFlowProvider';

/**
 * Main content component that uses the flow context
 */
const FlowBuilderContent: React.FC = () => {
  const { selectedNode } = useChatbotFlow();

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Header with Restore and Save Buttons */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-end items-center gap-3">
        <RestoreFlowButton />
        <FlowSaveButton />
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative h-full">
          <ChatbotFlowCanvas />
        </div>

        {/* Sidebar Panel */}
        <aside className="w-80 border-l border-gray-200 bg-white overflow-hidden">
          {selectedNode ? <NodeSettingsPanel /> : <AvailableNodesPanel />}
        </aside>
      </div>
    </div>
  );
};

/**
 * Main page component
 */
export default function Home() {
  return (
    <ReactFlowProvider>
      <ChatbotFlowProvider>
        <FlowBuilderContent />
      </ChatbotFlowProvider>
    </ReactFlowProvider>
  );
}