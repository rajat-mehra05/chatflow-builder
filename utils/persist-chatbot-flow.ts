import { FlowState } from '@/types/chatbot-flow-types';

const STORAGE_KEY = 'chatflow-builder-flow';

/**
 * Saves flow state to localStorage
 */
export const saveFlowToStorage = (flowState: FlowState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const serialized = JSON.stringify(flowState);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save flow to localStorage:', error);
  }
};

/**
 * Loads flow state from localStorage
 * Returns null if no data exists or if data is corrupted
 */
export const loadFlowFromStorage = (): FlowState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) {
      return null;
    }

    const parsed = JSON.parse(serialized) as FlowState;

    // Basic validation
    if (
      !parsed ||
      !Array.isArray(parsed.nodes) ||
      !Array.isArray(parsed.edges)
    ) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load flow from localStorage:', error);
    return null;
  }
};

/**
 * Clears flow state from localStorage
 */
export const clearFlowStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear flow from localStorage:', error);
  }
};