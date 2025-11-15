import { NodeTypes } from 'reactflow';
import { ChatbotNodeType } from '@/types/chatbot-flow-types';
import { TextMessageNode } from './TextMessageNode';
import { ButtonMessageNode } from './ButtonMessageNode';

/**
 * Node type registry for React Flow
 * Maps node types to their corresponding components
 * Extend this object when adding new node types
 */
export const chatbotNodeTypes: NodeTypes = {
  [ChatbotNodeType.TEXT_MESSAGE]: TextMessageNode,
  [ChatbotNodeType.BUTTON]: ButtonMessageNode,
};
