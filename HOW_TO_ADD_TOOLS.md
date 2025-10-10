# How to Add New Tools

This is a standard Next.js website where each tool is simply a new page. Here's how to add a new tool:

## 1. Create the Tool Page

Create a new directory and page file:
```
app/tools/your-tool-name/page.tsx
```

## 2. Copy the Template

Copy the content from `app/tools/proposal-writer/page.tsx` and modify:
- Tool configuration (name, description, webhook URL, parameters)
- Any custom logic specific to your tool

**Or copy from `app/tools/task-manager/page.tsx` for a standalone tool without webhooks**

## 3. Update the Sidebar

Add your tool to the `tools` array in `components/ToolSidebar.tsx`:
```typescript
const tools = [
  {
    id: 'proposal-writer',
    name: 'Proposal Writer',
    icon: '📝',
    href: '/tools/proposal-writer'
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    icon: '✅',
    href: '/tools/task-manager'
  },
  {
    id: 'your-tool-name',
    name: 'Your Tool Name',
    icon: '🔧',
    href: '/tools/your-tool-name'
  }
];
```

## 4. Update the Home Page

Add your tool to the `tools` array in `app/page.tsx`:
```typescript
const tools = [
  {
    id: 'proposal-writer',
    name: 'Proposal Writer',
    description: 'Generate professional proposals...',
    icon: '📝',
    href: '/tools/proposal-writer'
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Organize your tasks with a beautiful black and purple gradient theme.',
    icon: '✅',
    href: '/tools/task-manager'
  },
  {
    id: 'your-tool-name',
    name: 'Your Tool Name',
    description: 'Your tool description...',
    icon: '🔧',
    href: '/tools/your-tool-name'
  }
];
```

## That's it!

Each tool is completely independent - just a regular Next.js page with its own route.

## Current Tools:
- **Proposal Writer** (`/tools/proposal-writer`) - Webhook-based tool for generating proposals
- **CSV Processor** (`/tools/csv-processor`) - Webhook-based tool for processing CSV files  
- **Task Manager** (`/tools/task-manager`) - Standalone todo list with black/purple gradient theme
