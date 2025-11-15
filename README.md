# Chatbot Flow Builder

A drag-and-drop chatbot flow builder built with Next.js, React Flow, and TypeScript.

## Features

- **Text Message Nodes**: Create and edit text messages in your chatbot flow
- **Button Nodes**: Add interactive buttons with custom text and values
- **Drag & Drop**: Easily add nodes by dragging from the nodes panel
- **Visual Flow**: Connect nodes to create conversation flows
- **Settings Panel**: Edit node properties when selected
- **Auto-save**: Flow state is automatically saved to localStorage
- **Validation**: Save button validates flow structure before saving

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Add Nodes**: Drag a node from the "Nodes Panel" on the right and drop it onto the canvas
2. **Connect Nodes**: Click and drag from a node's source handle (right side) to another node's target handle (left side)
3. **Edit Nodes**: Click on a node to select it and edit its properties in the settings panel
4. **Save Flow**: Click "Save Changes" to validate and save your flow

## Project Structure

- `app/` - Next.js app directory with pages and layout
- `components/` - React components (flow nodes, panels, providers)
- `types/` - TypeScript type definitions
- `utils/` - Utility functions (node creation, helpers, persistence)
- `lib/` - Library configurations and validation logic

## Extending the Builder

The codebase is designed to be extensible:

1. **Add New Node Types**: 
   - Define the node data type in `types/chatbot-flow-types.ts`
   - Create the node component in `components/chatbot-flow/`
   - Register it in `components/chatbot-flow/chatbot-node-registry.tsx`
   - Add creation function in `utils/create-chatbot-node.ts`
   - Add card in `components/sidebar-panels/AvailableNodesPanel.tsx`
   - Add form fields in `components/sidebar-panels/NodeSettingsPanel.tsx`

2. **Add Validation Rules**: Extend `lib/flow-validation-rules.ts`

3. **Modify Persistence**: Update `utils/persist-chatbot-flow.ts`

## Technologies Used

- Next.js 14
- React 18
- React Flow 11
- TypeScript
- TailwindCSS