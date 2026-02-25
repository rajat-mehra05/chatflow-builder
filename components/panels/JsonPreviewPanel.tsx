'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useFlow } from '@/components/providers/FlowProvider';
import { flowToSchema } from '@/utils/flow-to-schema';
import { ImportJsonButton } from '@/components/ui/ImportJsonButton';

/**
 * Simple JSON syntax highlighter using regex tokenization.
 * Returns JSX spans with color classes — no external dependency needed.
 */
const highlightJson = (json: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  // Regex matches: strings, numbers, booleans/null, property keys
  const tokenRegex = /("(?:\\.|[^"\\])*")\s*:/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const keyPositions = new Set<string>();

  // First pass: find all key positions
  while ((match = tokenRegex.exec(json)) !== null) {
    keyPositions.add(`${match.index}-${match.index + match[1].length}`);
  }

  // Second pass: tokenize all strings, numbers, booleans
  const allTokens =
    /("(?:\\.|[^"\\])*")|([-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)/g;
  let tokenMatch: RegExpExecArray | null;
  lastIndex = 0;

  while ((tokenMatch = allTokens.exec(json)) !== null) {
    // Add plain text before this token
    if (tokenMatch.index > lastIndex) {
      parts.push(json.slice(lastIndex, tokenMatch.index));
    }

    const pos = `${tokenMatch.index}-${tokenMatch.index + (tokenMatch[1] || '').length}`;

    if (tokenMatch[1]) {
      // String — check if it's a key
      if (keyPositions.has(pos)) {
        parts.push(
          <span key={tokenMatch.index} className="text-indigo-600">
            {tokenMatch[0]}
          </span>
        );
      } else {
        parts.push(
          <span key={tokenMatch.index} className="text-green-700">
            {tokenMatch[0]}
          </span>
        );
      }
    } else if (tokenMatch[2]) {
      parts.push(
        <span key={tokenMatch.index} className="text-amber-600">
          {tokenMatch[0]}
        </span>
      );
    } else if (tokenMatch[3]) {
      parts.push(
        <span key={tokenMatch.index} className="text-blue-600">
          {tokenMatch[0]}
        </span>
      );
    }

    lastIndex = tokenMatch.index + tokenMatch[0].length;
  }

  // Remaining text
  if (lastIndex < json.length) {
    parts.push(json.slice(lastIndex));
  }

  return parts;
};

/**
 * Collapsible JSON preview panel.
 * Derives schema from flow state and displays it with syntax highlighting.
 */
export const JsonPreviewPanel: React.FC = () => {
  const { nodes, edges } = useFlow();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => clearTimeout(copyTimeoutRef.current);
  }, []);

  const schema = useMemo(() => flowToSchema(nodes, edges), [nodes, edges]);
  const jsonString = useMemo(() => JSON.stringify(schema, null, 2), [schema]);
  const highlighted = useMemo(() => highlightJson(jsonString), [jsonString]);

  const handleCopy = async () => {
    clearTimeout(copyTimeoutRef.current);
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  if (collapsed) {
    return (
      <div className="h-full flex flex-col border-l border-gray-200 bg-gray-50">
        <button
          onClick={() => setCollapsed(false)}
          className="p-2 hover:bg-gray-100 transition-colors"
          aria-label="Expand JSON preview"
          title="Expand JSON preview"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-center">
          <span
            className="text-xs text-gray-400 font-medium"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            JSON Preview
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-l border-gray-200 bg-gray-50 w-80">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">JSON Preview</h3>
        <div className="flex items-center gap-1">
          <ImportJsonButton />
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Copy JSON"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="text-xs px-2 py-1 rounded hover:bg-gray-100 text-gray-600 transition-colors"
            title="Download JSON"
          >
            Download
          </button>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500"
            aria-label="Collapse panel"
            title="Collapse"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* JSON content */}
      <div className="flex-1 overflow-auto p-3">
        <pre className="text-xs leading-relaxed font-mono whitespace-pre text-gray-800">
          {highlighted}
        </pre>
      </div>
    </div>
  );
};
