'use client';

import { Tool, FormData, WebhookResult } from '@/types/tools';
import WebhookToolDetails from './WebhookToolDetails';

interface ToolDetailsProps {
  tool: Tool;
  formData: FormData;
  onFormChange: (name: string, value: string) => void;
  onWebhookExecute: (fileData?: {[key: string]: File | null}) => void;
  isLoading: boolean;
  webhookResult: WebhookResult | null;
}

export default function ToolDetails({
  tool,
  formData,
  onFormChange,
  onWebhookExecute,
  isLoading,
  webhookResult,
}: ToolDetailsProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="p-8">
        {/* Tool Header */}
        <div className="mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
          </div>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Tool-specific content */}
        <WebhookToolDetails
          tool={tool}
          formData={formData}
          onFormChange={onFormChange}
          onExecute={onWebhookExecute}
          isLoading={isLoading}
          result={webhookResult}
        />
      </div>
    </div>
  );
}
