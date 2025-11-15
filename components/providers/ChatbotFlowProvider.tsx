'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { FlowNode, FlowEdge } from '@/types/chatbot-flow-types';
import { loadFlowFromStorage, saveFlowToStorage } from '@/utils/persist-chatbot-flow';

interface ChatbotFlowContextType {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
  addNode: (node: FlowNode) => void;
  updateNode: (nodeId: string, data: FlowNode['data']) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: Dispatch<SetStateAction<FlowNode[]>>;
  setEdges: Dispatch<SetStateAction<FlowEdge[]>>;
  selectNode: (nodeId: string | null) => void;
  deselectNode: () => void;
}

const ChatbotFlowContext = createContext<ChatbotFlowContextType | undefined>(
  undefined
);

/**
 * Custom hook to access chatbot flow context
 */
export const useChatbotFlow = (): ChatbotFlowContextType => {
  const context = useContext(ChatbotFlowContext);
  if (!context) {
    throw new Error('useChatbotFlow must be used within ChatbotFlowProvider');
  }
  return context;
};

interface ChatbotFlowProviderProps {
  children: ReactNode;
}

/**
 * Provider component for chatbot flow state management
 * Handles localStorage persistence with debouncing
 */
export const ChatbotFlowProvider: React.FC<ChatbotFlowProviderProps> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFlow = loadFlowFromStorage();
    if (savedFlow) {
      setNodes(savedFlow.nodes);
      setEdges(savedFlow.edges);
    }
    setIsInitialized(true);
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      saveFlowToStorage({ nodes, edges });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, isInitialized]);

  const addNode = useCallback((node: FlowNode) => {
    setNodes((prev) => [...prev, node]);
  }, []);

  const updateNode = useCallback((nodeId: string, data: FlowNode['data']) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, data } : node))
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const selectNode = useCallback((nodeId: string | null) => {
    if (!nodeId) {
      setSelectedNode(null);
      return;
    }
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode(node || null);
  }, [nodes]);

  const deselectNode = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const value: ChatbotFlowContextType = {
    nodes,
    edges,
    selectedNode,
    addNode,
    updateNode,
    deleteNode,
    setNodes,
    setEdges,
    selectNode,
    deselectNode,
  };

  return (
    <ChatbotFlowContext.Provider value={value}>
      {children}
    </ChatbotFlowContext.Provider>
  );
};