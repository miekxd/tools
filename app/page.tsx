'use client';

import Link from 'next/link';
import ToolSidebar from '@/components/ToolSidebar';

export default function Home() {
  const tools = [
    {
      id: 'proposal-writer',
      name: 'Proposal Writer',
      description: 'Generate professional proposals by analyzing transcript content and component catalog data.',
      icon: '📝',
      href: '/tools/proposal-writer'
    },
    {
      id: 'csv-processor',
      name: 'CSV Processor',
      description: 'Process and analyze CSV files with advanced filtering and transformation options.',
      icon: '📊',
      href: '/tools/csv-processor'
    },
    {
      id: 'task-manager',
      name: 'Task Manager',
      description: 'Organize your tasks with a beautiful black and purple gradient theme.',
      icon: '✅',
      href: '/tools/task-manager'
    }
    // Add more tools here as you create them
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-white border-r border-gray-200 flex flex-col">
          <ToolSidebar />
        </div>

        {/* Main Content */}
        <div className="w-5/6 flex flex-col">
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Tools
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Select a tool from the sidebar to get started, or browse all available tools below.
                  </p>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tools.map((tool) => (
                    <Link key={tool.id} href={tool.href}>
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                        <div className="flex items-center space-x-3 mb-4">
                          <span className="text-2xl">{tool.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tool.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {tool.description}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <span className="text-blue-600 text-sm font-medium">
                            Use Tool →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Empty state if no tools */}
                {tools.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔧</div>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                      No Tools Available
                    </h2>
                    <p className="text-gray-500">
                      Tools will appear here once they are created.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
