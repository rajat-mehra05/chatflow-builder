# Flow Builder

A single-page visual flow builder where users construct flows on a canvas and export them as JSON. Built with Next.js 14, React Flow 11, TypeScript, and Tailwind CSS.

## Features

### Canvas
- **Drag & drop** nodes from the sidebar onto the canvas
- **Connect nodes** by drawing edges between handles
- **Edge condition labels** displayed on the canvas with text wrapping
- **Visual start node** indicator (amber header + star icon)
- **Validation badges** on nodes with warnings (amber border + badge)
- **Delete key / Backspace** removes selected node or edge (guarded against input focus)
- Pan, zoom, minimap, and fit-to-view controls

### Node Sidebar
- **Editable node ID** (displayId) with uniqueness validation
- **Description** and **prompt** fields with required-field validation
- **Start node toggle** (enforces single start node)
- **Outgoing edge management** — add, remove, edit condition text, and set target node
- **Edge parameters** — optional key-value pairs per edge
- **Touched-state validation** — inline errors shown only after the user interacts with a field (blur), not on creation

### JSON Preview Panel (collapsible)
- **Live JSON preview** derived from canvas state, updated on every change
- **Syntax highlighting** (CSS-based regex tokenizer, no external dependency)
- **Copy to clipboard** with checkmark feedback
- **Download** as `.json` file
- **Import JSON** — paste or upload a `.json` file to replace the current flow with schema validation and BFS auto-layout

### Validation
- Node IDs must be unique (inline error)
- Description is required (inline error)
- Start node must exist (banner warning)
- Disconnected / orphaned node warnings (canvas badge)
- Edge missing condition text warning
- Export blocked when blocking errors exist

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Internal UUID vs user-facing displayId** | React Flow uses `node.id` as React key. Mutating it destroys/recreates the node. We use an internal UUID as `node.id` and store the editable ID in `node.data.displayId`. |
| **Derive JSON, don't store it** | The JSON preview is computed from canvas state via `useMemo`. Single source of truth — no sync bugs. |
| **Derive selectedNode, don't snapshot it** | Store `selectedNodeId` only; derive the node object from the current `nodes` array via `useMemo`. Prevents stale sidebar data. |
| **Context API, not Redux** | App is small. Context + `useMemo` is sufficient. Redux/Zustand would be overengineering. |
| **Touched-state validation** | Don't show errors on fields the user hasn't interacted with. Validate on blur, not on mount. |
| **CSS syntax highlighting** | Read-only JSON display doesn't need a code editor. A regex tokenizer keeps the bundle small. |
| **BFS auto-layout on import** | Imported JSON has no position data. BFS from the start node produces a clean hierarchical layout without adding a dependency like dagre. |
| **Import = clear + replace** | Merging imported flow with existing flow is complex and error-prone. Replace with confirmation warning. |
| **Allow self-referencing edges** | Valid for conversation flows (e.g., retry loops). React Flow renders these as loop arcs. |
| **Omit empty parameters** | Schema says `parameters?` (optional). Cleaner JSON when omitted vs `parameters: {}`. |

## Technologies

- Next.js 14
- React 18
- React Flow 11
- TypeScript (strict)
- Tailwind CSS
