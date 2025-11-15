'use client';

import React, { useState, useEffect } from 'react';
import { useChatbotFlow } from '@/components/providers/ChatbotFlowProvider';
import { ChatbotNodeType, TextNodeData, ButtonNodeData } from '@/types/chatbot-flow-types';

/**
 * Node settings panel component
 * Displays form fields for editing the selected node
 */
export const NodeSettingsPanel: React.FC = () => {
  const { selectedNode, updateNode, deselectNode } = useChatbotFlow();
  const [textValue, setTextValue] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonValue, setButtonValue] = useState('');

  // Update form values when selected node changes
  useEffect(() => {
    if (!selectedNode) return;

    if (selectedNode.type === ChatbotNodeType.TEXT_MESSAGE) {
      const data = selectedNode.data as TextNodeData;
      setTextValue(data.text || '');
    } else if (selectedNode.type === ChatbotNodeType.BUTTON) {
      const data = selectedNode.data as ButtonNodeData;
      setButtonText(data.buttonText || '');
      setButtonValue(data.buttonValue || '');
    }
  }, [selectedNode]);

  const handleTextChange = (value: string) => {
    setTextValue(value);
    if (selectedNode) {
      updateNode(selectedNode.id, { text: value } as TextNodeData);
    }
  };

  const handleButtonTextChange = (value: string) => {
    setButtonText(value);
    if (selectedNode) {
      const currentData = selectedNode.data as ButtonNodeData;
      updateNode(selectedNode.id, {
        ...currentData,
        buttonText: value,
      } as ButtonNodeData);
    }
  };

  const handleButtonValueChange = (value: string) => {
    setButtonValue(value);
    if (selectedNode) {
      const currentData = selectedNode.data as ButtonNodeData;
      updateNode(selectedNode.id, {
        ...currentData,
        buttonValue: value,
      } as ButtonNodeData);
    }
  };

  if (!selectedNode) {
    return null;
  }

  const getNodeTypeLabel = () => {
    switch (selectedNode.type) {
      case ChatbotNodeType.TEXT_MESSAGE:
        return 'Message';
      case ChatbotNodeType.BUTTON:
        return 'Button';
      default:
        return 'Node';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={deselectNode}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {getNodeTypeLabel()}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedNode.type === ChatbotNodeType.TEXT_MESSAGE && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Text
            </label>
            <textarea
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              placeholder="Enter message text..."
            />
          </div>
        )}

        {selectedNode.type === ChatbotNodeType.BUTTON && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => handleButtonTextChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter button text..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Value
              </label>
              <input
                type="text"
                value={buttonValue}
                onChange={(e) => handleButtonValueChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter button value..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};