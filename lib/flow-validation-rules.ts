import { FlowNode, FlowEdge } from '@/types/chatbot-flow-types';
import { getNodesWithEmptyTargetHandles } from '@/utils/chatbot-flow-helpers';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Validates the chatbot flow
 * Rule: If there are more than 1 nodes, at most 1 node can have empty target handles
 */
export const validateChatbotFlow = (
  nodes: FlowNode[],
  edges: FlowEdge[]
): ValidationResult => {
  // If there's only one or zero nodes, flow is valid
  if (nodes.length <= 1) {
    return { isValid: true };
  }

  // Get nodes with empty target handles
  const nodesWithEmptyTargets = getNodesWithEmptyTargetHandles(nodes, edges);

  // If more than 1 node has empty target handles, flow is invalid
  if (nodesWithEmptyTargets.length > 1) {
    return {
      isValid: false,
      errorMessage: 'Cannot save Flow',
    };
  }

  return { isValid: true };
};