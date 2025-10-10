export interface ToolParameter {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'file';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  accept?: string; // For file inputs (e.g., ".txt,.pdf,.doc,.docx")
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  type: 'webhook';
  category: string;
  icon: string;
  parameters: ToolParameter[];
}

export interface WebhookResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface FormData {
  [key: string]: string;
}
