import { XYPosition } from 'reactflow';
import { ChatbotNodeType, FlowNode, TextNodeData, ButtonNodeData } from '@/types/chatbot-flow-types';

/**
 * Creates a unique node ID
 */
const generateNodeId = (type: ChatbotNodeType): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates a new Text Message node at the specified position
 */
export const createTextMessageNode = (position: XYPosition): FlowNode => {
  return {
    id: generateNodeId(ChatbotNodeType.TEXT_MESSAGE),
    type: ChatbotNodeType.TEXT_MESSAGE,
    position,
    data: {
      text: '',
    } as TextNodeData,
  };
};

/**
 * Creates a new Button node at the specified position
 */
export const createButtonMessageNode = (position: XYPosition): FlowNode => {
  return {
    id: generateNodeId(ChatbotNodeType.BUTTON),
    type: ChatbotNodeType.BUTTON,
    position,
    data: {
      buttonText: '',
      buttonValue: '',
    } as ButtonNodeData,
  };
};

/**
 * Generic factory function to create nodes based on type
 */
export const createChatbotNode = (
  nodeType: ChatbotNodeType,
  position: XYPosition
): FlowNode => {
  switch (nodeType) {
    case ChatbotNodeType.TEXT_MESSAGE:
      return createTextMessageNode(position);
    case ChatbotNodeType.BUTTON:
      return createButtonMessageNode(position);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
};
