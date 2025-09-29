'use client';

import { Tool } from '@/types/tools';

interface ToolSidebarProps {
  tools: Tool[];
  selectedTool: Tool | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToolSelect: (tool: Tool) => void;
}

export default function ToolSidebar({
  tools,
  selectedTool,
  searchQuery,
  onSearchChange,
  onToolSelect,
}: ToolSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Tools</h1>
      </div>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSelected={selectedTool?.id === tool.id}
              onClick={() => onToolSelect(tool)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

interface ToolCardProps {
  tool: Tool;
  isSelected: boolean;
  onClick: () => void;
}

function ToolCard({ tool, isSelected, onClick }: ToolCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 border-blue-500 shadow-sm' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <h3 className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
        {tool.name}
      </h3>
    </div>
  );
}

