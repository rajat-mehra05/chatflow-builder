'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  OnNodesChange,
  OnEdgesChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlow } from '@/components/providers/FlowProvider';
import { flowNodeTypes } from './flow-node-registry';
import { flowEdgeTypes } from './flow-edge-registry';
import { defaultEdgeOptions, defaultViewport } from '@/lib/reactflow-canvas-config';
import { createFlowNode } from '@/utils/create-flow-node';
import { createFlowEdge, isDuplicateEdge } from '@/utils/create-flow-edge';
import { FLOW_NODE_TYPE, FlowNode, FlowEdge } from '@/types/flow-types';
import { useFlowValidation } from '@/hooks/useFlowValidation';

const BLOCKING_WARNINGS = new Set([
  'Node ID is empty',
  'Duplicate node ID',
  'Description is empty',
]);

/**
 * Main React Flow canvas component.
 * Handles node/edge changes, drag-drop, and pane click deselection.
 */
export const FlowCanvas: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, selectNode } = useFlow();
  const { screenToFlowPosition } = useReactFlow();
  const { nodeWarnings } = useFlowValidation(nodes, edges);

  // Enrich nodes: inject _warnings for badge display, add CSS class for blocking errors
  const enrichedNodes = useMemo(() => {
    return nodes.map((n) => {
      const warnings = nodeWarnings.get(n.id);
      if (!warnings || warnings.length === 0) return n;
      const hasBlockingError = warnings.some((w) => BLOCKING_WARNINGS.has(w));
      return {
        ...n,
        className: hasBlockingError ? 'validation-error' : n.className,
        data: { ...n.data, _warnings: warnings },
      };
    });
  }, [nodes, nodeWarnings]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as FlowNode[]);
    },
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds) as FlowEdge[]);
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const { source, target, sourceHandle, targetHandle } = connection;
      if (!source || !target) return;
      setEdges((eds) => {
        if (isDuplicateEdge(eds, source, target)) return eds;
        return [...eds, createFlowEdge(source, target, sourceHandle, targetHandle)];
      });
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (nodeType !== FLOW_NODE_TYPE) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(position);
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: { id: string }) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="w-full h-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={enrichedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={flowNodeTypes}
        edgeTypes={flowEdgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        defaultViewport={defaultViewport}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
