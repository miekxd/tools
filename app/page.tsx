'use client';

import { useState } from 'react';
import { tools } from '@/data/tools';
import { Tool, FormData, WebhookResult } from '@/types/tools';
import { executeWebhook } from '@/utils/webhook';
import ToolSidebar from '@/components/ToolSidebar';
import ToolDetails from '@/components/ToolDetails';

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(tools[0] || null);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [webhookResult, setWebhookResult] = useState<WebhookResult | null>(null);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    setFormData({});
    setWebhookResult(null);
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWebhookExecute = async (fileData?: {[key: string]: File | null}) => {
    if (!selectedTool || selectedTool.type !== 'webhook') return;

    setIsLoading(true);
    setWebhookResult(null);

    try {
      const result = await executeWebhook(selectedTool, formData, fileData);
      setWebhookResult(result);
    } catch (error) {
      setWebhookResult({
        success: false,
        error: 'Failed to execute webhook',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/6 bg-white border-r border-gray-200 flex flex-col">
          <ToolSidebar
            tools={tools}
            selectedTool={selectedTool}
            searchQuery=""
            onSearchChange={() => {}}
            onToolSelect={handleToolSelect}
          />
        </div>

        {/* Main Content */}
        <div className="w-5/6 flex flex-col">
          {selectedTool ? (
            <ToolDetails
              tool={selectedTool}
              formData={formData}
              onFormChange={handleFormChange}
              onWebhookExecute={handleWebhookExecute}
              isLoading={isLoading}
              webhookResult={webhookResult}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                  Select a Tool
                </h2>
                <p className="text-gray-500">
                  Choose a tool from the sidebar to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
