'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ToolSidebar() {
  const pathname = usePathname();

  const tools = [
    {
      id: 'proposal-writer',
      name: 'Proposal Writer',
      icon: '📝',
      href: '/tools/proposal-writer'
    },
    {
      id: 'csv-processor',
      name: 'CSV Processor',
      icon: '📊',
      href: '/tools/csv-processor'
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      icon: '✅',
      href: '/tools/task-manager'
    }
    // Add more tools here as you create them
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-blue-600">
          Tools
        </Link>
      </div>

      {/* Tool List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSelected={pathname === tool.href}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    icon: string;
    href: string;
  };
  isSelected: boolean;
}

function ToolCard({ tool, isSelected }: ToolCardProps) {
  return (
    <Link href={tool.href}>
      <div
        className={`
          p-3 mb-2 rounded-lg border cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'bg-blue-50 border-blue-500 shadow-sm' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }
        `}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{tool.icon}</span>
          <h3 className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
            {tool.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}

