'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { FlowNode, FlowEdge, FlowNodeData } from '@/types/flow-types';
import { loadFlowFromStorage, saveFlowToStorage } from '@/utils/persist-flow';

interface FlowContextType {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
  selectedNodeId: string | null;
  setNodes: Dispatch<SetStateAction<FlowNode[]>>;
  setEdges: Dispatch<SetStateAction<FlowEdge[]>>;
  addNode: (node: FlowNode) => void;
  updateNodeData: (nodeId: string, data: Partial<FlowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setStartNode: (nodeId: string) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

/**
 * Hook to access flow context. Must be used within FlowProvider.
 */
export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider');
  }
  return context;
};

interface FlowProviderProps {
  children: ReactNode;
}

/**
 * Provider component for flow state management.
 * Fixes stale selectedNode by deriving it from selectedNodeId + nodes via useMemo.
 */
export const FlowProvider: React.FC<FlowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [edges, setEdges] = useState<FlowEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Derived: always reflects latest nodes array. Never stale.
  const selectedNode = useMemo(
    () => (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) ?? null : null),
    [selectedNodeId, nodes]
  );

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

  const updateNodeData = useCallback(
    (nodeId: string, dataUpdate: Partial<FlowNodeData>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...dataUpdate } }
            : node
        )
      );
    },
    []
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
    setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  /**
   * Enforces single start node: sets target node as start, clears all others.
   */
  const setStartNode = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        data: { ...node.data, isStart: node.id === nodeId },
      }))
    );
  }, []);

  const value = useMemo<FlowContextType>(
    () => ({
      nodes,
      edges,
      selectedNode,
      selectedNodeId,
      setNodes,
      setEdges,
      addNode,
      updateNodeData,
      deleteNode,
      selectNode,
      setStartNode,
    }),
    [nodes, edges, selectedNode, selectedNodeId, addNode, updateNodeData, deleteNode, selectNode, setStartNode]
  );

  return (
    <FlowContext.Provider value={value}>
      {children}
    </FlowContext.Provider>
  );
};
