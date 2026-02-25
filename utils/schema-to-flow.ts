import { FlowNode, FlowEdge, FLOW_NODE_TYPE, FLOW_EDGE_TYPE } from '@/types/flow-types';
import { FlowSchema } from './flow-to-schema';

export interface ImportResult {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Validates that the input conforms to the FlowSchema shape.
 * Returns an array of human-readable error messages (empty = valid).
 */
export const validateImportSchema = (data: unknown): string[] => {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push('Input must be a JSON object');
    return errors;
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.start_node_id !== 'string') {
    errors.push('Missing or invalid "start_node_id" (must be a string)');
  }

  if (!Array.isArray(obj.nodes)) {
    errors.push('Missing or invalid "nodes" (must be an array)');
    return errors;
  }

  if (obj.nodes.length === 0) {
    errors.push('Flow must contain at least one node');
    return errors;
  }

  const nodeIds = new Set<string>();

  for (let i = 0; i < obj.nodes.length; i++) {
    const node = obj.nodes[i] as Record<string, unknown>;
    const prefix = `nodes[${i}]`;

    if (!node || typeof node !== 'object') {
      errors.push(`${prefix}: must be an object`);
      continue;
    }

    if (typeof node.id !== 'string' || !node.id.trim()) {
      errors.push(`${prefix}: missing or empty "id"`);
    } else {
      if (nodeIds.has(node.id as string)) {
        errors.push(`${prefix}: duplicate node id "${node.id}"`);
      }
      nodeIds.add(node.id as string);
    }

    if (typeof node.description !== 'string') {
      errors.push(`${prefix}: missing "description"`);
    }

    if (typeof node.prompt !== 'string') {
      errors.push(`${prefix}: missing "prompt"`);
    }

    if (!Array.isArray(node.edges)) {
      errors.push(`${prefix}: missing or invalid "edges" (must be an array)`);
    } else {
      for (let j = 0; j < (node.edges as unknown[]).length; j++) {
        const edge = (node.edges as Record<string, unknown>[])[j];
        const ep = `${prefix}.edges[${j}]`;

        if (!edge || typeof edge !== 'object') {
          errors.push(`${ep}: must be an object`);
          continue;
        }

        if (typeof edge.to_node_id !== 'string' || !(edge.to_node_id as string).trim()) {
          errors.push(`${ep}: missing or empty "to_node_id"`);
        }

        if (typeof edge.condition !== 'string') {
          errors.push(`${ep}: missing "condition"`);
        }

        if (edge.parameters !== undefined) {
          if (typeof edge.parameters !== 'object' || Array.isArray(edge.parameters) || edge.parameters === null) {
            errors.push(`${ep}: "parameters" must be a plain object`);
          }
        }
      }
    }
  }

  // Check start_node_id references a valid node
  if (typeof obj.start_node_id === 'string' && obj.start_node_id.trim() && nodeIds.size > 0) {
    if (!nodeIds.has(obj.start_node_id)) {
      errors.push(`"start_node_id" ("${obj.start_node_id}") does not match any node id`);
    }
  }

  // Check all edge to_node_id references exist
  if (Array.isArray(obj.nodes)) {
    for (const node of obj.nodes as Record<string, unknown>[]) {
      if (!node || typeof node !== 'object' || !Array.isArray(node.edges)) continue;
      for (const edge of node.edges as Record<string, unknown>[]) {
        if (!edge || typeof edge !== 'object') continue;
        if (typeof edge.to_node_id === 'string' && edge.to_node_id.trim()) {
          if (!nodeIds.has(edge.to_node_id)) {
            errors.push(`Edge to_node_id "${edge.to_node_id}" does not match any node id`);
          }
        }
      }
    }
  }

  return errors;
};

/**
 * BFS auto-layout starting from the start node.
 * Places nodes in horizontal layers, top-down.
 * Unreachable nodes are placed in a final row.
 */
const autoLayout = (
  nodeCount: number,
  startIndex: number,
  adjacency: Map<number, number[]>,
): { x: number; y: number }[] => {
  const NODE_W = 280;
  const NODE_H = 150;
  const GAP_X = 60;
  const GAP_Y = 80;

  const positions: { x: number; y: number }[] = new Array(nodeCount);
  const visited = new Set<number>();
  const levels: number[][] = [];

  // BFS from start node
  if (startIndex >= 0 && startIndex < nodeCount) {
    const queue: number[] = [startIndex];
    visited.add(startIndex);

    while (queue.length > 0) {
      const level: number[] = [];
      const size = queue.length;
      for (let i = 0; i < size; i++) {
        const cur = queue.shift()!;
        level.push(cur);
        for (const neighbor of adjacency.get(cur) || []) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      levels.push(level);
    }
  }

  // Unreachable nodes go in a final row
  const unreachable: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    if (!visited.has(i)) unreachable.push(i);
  }
  if (unreachable.length > 0) levels.push(unreachable);

  // Assign positions centered per level
  for (let li = 0; li < levels.length; li++) {
    const row = levels[li];
    const totalW = row.length * NODE_W + (row.length - 1) * GAP_X;
    const startX = -totalW / 2;
    for (let i = 0; i < row.length; i++) {
      positions[row[i]] = {
        x: startX + i * (NODE_W + GAP_X),
        y: li * (NODE_H + GAP_Y),
      };
    }
  }

  return positions;
};

/**
 * Converts an imported FlowSchema into React Flow nodes and edges.
 * Generates internal UUIDs, maps displayId references, and auto-layouts.
 */
export const schemaToFlow = (schema: FlowSchema): ImportResult => {
  // displayId → internal UUID
  const idMap = new Map<string, string>();
  for (const node of schema.nodes) {
    idMap.set(node.id, crypto.randomUUID());
  }

  // Build adjacency for layout (index-based)
  const indexMap = new Map<string, number>();
  schema.nodes.forEach((n, i) => indexMap.set(n.id, i));

  const adjacency = new Map<number, number[]>();
  for (let i = 0; i < schema.nodes.length; i++) {
    const neighbors: number[] = [];
    for (const edge of schema.nodes[i].edges) {
      const ti = indexMap.get(edge.to_node_id);
      if (ti !== undefined) neighbors.push(ti);
    }
    adjacency.set(i, neighbors);
  }

  const startIdx = indexMap.get(schema.start_node_id) ?? -1;
  const positions = autoLayout(schema.nodes.length, startIdx, adjacency);

  // Create FlowNode[]
  const nodes: FlowNode[] = schema.nodes.map((sn, i) => ({
    id: idMap.get(sn.id)!,
    type: FLOW_NODE_TYPE,
    position: positions[i] || { x: i * 340, y: 0 },
    data: {
      displayId: sn.id,
      description: sn.description,
      prompt: sn.prompt,
      isStart: sn.id === schema.start_node_id,
    },
  }));

  // Create FlowEdge[]
  const edges: FlowEdge[] = [];
  for (const sn of schema.nodes) {
    const sourceId = idMap.get(sn.id)!;
    for (const se of sn.edges) {
      const targetId = idMap.get(se.to_node_id);
      if (!targetId) continue;

      // Convert Record<string,string> → array format
      let parameters: { id: string; key: string; value: string }[] | undefined;
      if (se.parameters && Object.keys(se.parameters).length > 0) {
        parameters = Object.entries(se.parameters).map(([key, value]) => ({
          id: crypto.randomUUID(),
          key,
          value,
        }));
      }

      edges.push({
        id: crypto.randomUUID(),
        source: sourceId,
        target: targetId,
        type: FLOW_EDGE_TYPE,
        data: {
          condition: se.condition,
          ...(parameters ? { parameters } : {}),
        },
      });
    }
  }

  return { nodes, edges };
};
