import { Tool } from '@/types/tools';

export const tools: Tool[] = [
  {
    id: 'proposal-writer-agent',
    name: 'Proposal Writer Agent',
    description: 'Generate professional proposals by analyzing transcript content and component catalog data. Upload your transcript and component catalog files to create comprehensive, tailored proposals.',
    webhookUrl: 'https://mikeusdominus.app.n8n.cloud/webhook-test/proposal-writer',
    type: 'webhook',
    parameters: [
      {
        name: 'transcript',
        type: 'file',
        placeholder: 'Upload transcript file',
        required: true,
        accept: '.txt,.pdf,.doc,.docx,.json'
      },
      {
        name: 'componentCatalog',
        type: 'file',
        placeholder: 'Upload component catalog file',
        required: true,
        accept: '.txt,.pdf,.doc,.docx,.json'
      },
      {
        name: 'additionalRequirements',
        type: 'textarea',
        placeholder: 'Any specific requirements or instructions for the proposal...',
        required: false
      }
    ]
  }
];
