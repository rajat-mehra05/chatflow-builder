'use client';

import React, { useCallback } from 'react';
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

/**
 * Main React Flow canvas component.
 * Handles node/edge changes, drag-drop, and pane click deselection.
 */
export const FlowCanvas: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, selectNode } = useFlow();
  const { screenToFlowPosition } = useReactFlow();

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
      const { source, target } = connection;
      if (!source || !target) return;
      setEdges((eds) => {
        if (isDuplicateEdge(eds, source, target)) return eds;
        return [...eds, createFlowEdge(source, target)];
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
        nodes={nodes}
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
