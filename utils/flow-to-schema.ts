import { FlowNode, FlowEdge } from '@/types/flow-types';

/**
 * Schema types matching the assignment specification.
 */
export interface SchemaEdge {
  to_node_id: string;
  condition: string;
  parameters?: Record<string, string>;
}

export interface SchemaNode {
  id: string;
  description: string;
  prompt: string;
  edges: SchemaEdge[];
}

export interface FlowSchema {
  start_node_id: string;
  nodes: SchemaNode[];
}

/**
 * Derives the JSON schema from React Flow nodes and edges.
 * Maps internal UUIDs to user-facing displayIds.
 * Omits parameters when empty.
 */
export const flowToSchema = (nodes: FlowNode[], edges: FlowEdge[]): FlowSchema => {
  // Build internal-id → displayId lookup
  const idToDisplayId = new Map<string, string>();
  for (const node of nodes) {
    idToDisplayId.set(node.id, node.data.displayId);
  }

  const startNode = nodes.find((n) => n.data.isStart);

  const schemaNodes: SchemaNode[] = nodes.map((node) => {
    const outgoing = edges.filter((e) => e.source === node.id);

    const schemaEdges: SchemaEdge[] = outgoing.map((edge) => {
      const targetDisplayId = idToDisplayId.get(edge.target) || edge.target;
      const condition = edge.data?.condition || '';
      const params = edge.data?.parameters;

      const schemaEdge: SchemaEdge = {
        to_node_id: targetDisplayId,
        condition,
      };

      // Only include parameters when non-empty
      if (params && params.length > 0) {
        const record: Record<string, string> = {};
        for (const p of params) {
          if (p.key) record[p.key] = p.value;
        }
        if (Object.keys(record).length > 0) {
          schemaEdge.parameters = record;
        }
      }

      return schemaEdge;
    });

    return {
      id: node.data.displayId,
      description: node.data.description,
      prompt: node.data.prompt,
      edges: schemaEdges,
    };
  });

  return {
    start_node_id: startNode ? startNode.data.displayId : '',
    nodes: schemaNodes,
  };
};
