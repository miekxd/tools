import { WebhookResult, FormData, Tool } from '@/types/tools';

export async function executeWebhook(
  tool: Tool,
  formData: FormData,
  fileData?: {[key: string]: File | null}
): Promise<WebhookResult> {
  try {
    const payload = {
      toolName: tool.name,
      timestamp: new Date().toISOString(),
      ...formData
    };

    // Add file metadata if files are present
    if (fileData) {
      const fileMetadata: {[key: string]: any} = {};
      Object.entries(fileData).forEach(([key, file]) => {
        if (file) {
          fileMetadata[`${key}Metadata`] = {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            lastModified: file.lastModified
          };
        }
      });
      Object.assign(payload, fileMetadata);
    }

    const response = await fetch(tool.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }
}
