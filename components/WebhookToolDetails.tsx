'use client';

import { Tool, FormData, WebhookResult } from '@/types/tools';
import { useState, useEffect } from 'react';

interface WebhookToolDetailsProps {
  tool: Tool;
  formData: FormData;
  onFormChange: (name: string, value: string) => void;
  onExecute: (fileData?: FileData) => void;
  isLoading: boolean;
  result: WebhookResult | null;
}

interface FileData {
  [key: string]: File | null;
}

export default function WebhookToolDetails({
  tool,
  formData,
  onFormChange,
  onExecute,
  isLoading,
  result,
}: WebhookToolDetailsProps) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [fileData, setFileData] = useState<FileData>({});
  const [fileErrors, setFileErrors] = useState<{[key: string]: string}>({});

  const validateFile = (file: File, param: any): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = param.accept ? param.accept.split(',').map((type: string) => type.trim()) : [];
    
    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }
    
    if (allowedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return `File type not supported. Allowed types: ${allowedTypes.join(', ')}`;
      }
    }
    
    return null;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      } else {
        // For now, we'll just read as text for other file types
        // In a real implementation, you'd use libraries like pdf-parse for PDFs
        reader.readAsText(file);
      }
    });
  };

  const handleFileChange = async (file: File | null, paramName: string) => {
    if (!file) {
      setFileData(prev => ({ ...prev, [paramName]: null }));
      setFileErrors(prev => ({ ...prev, [paramName]: '' }));
      return;
    }

    const param = tool.parameters.find(p => p.name === paramName);
    const error = validateFile(file, param);
    if (error) {
      setFileErrors(prev => ({ ...prev, [paramName]: error }));
      return;
    }

    setFileErrors(prev => ({ ...prev, [paramName]: '' }));
    setFileData(prev => ({ ...prev, [paramName]: file }));

    // Extract text content and store in form data
    try {
      const textContent = await extractTextFromFile(file);
      onFormChange(paramName, textContent);
    } catch (error) {
      setFileErrors(prev => ({ 
        ...prev, 
        [paramName]: 'Failed to read file content' 
      }));
    }
  };

  const validateForm = () => {
    const requiredFields = tool.parameters.filter(param => param.required);
    
    const isValid = requiredFields.every(param => {
      if (param.type === 'file') {
        return fileData[param.name] && !fileErrors[param.name];
      }
      return formData[param.name] && formData[param.name].trim() !== '';
    });
    
    setIsFormValid(isValid);
  };

  const handleFormChange = (name: string, value: string) => {
    onFormChange(name, value);
    // Validate form after a short delay to allow state to update
    setTimeout(validateForm, 100);
  };

  // Validate form when fileData or fileErrors change
  useEffect(() => {
    validateForm();
  }, [fileData, fileErrors]);

  const renderFormField = (param: any) => {
    const value = formData[param.name] || '';
    const file = fileData[param.name];
    const fileError = fileErrors[param.name];

    switch (param.type) {
      case 'file':
        return (
          <div className="space-y-2">
            <div className="relative">
              <label htmlFor={param.name} className="block text-sm font-medium text-gray-700 mb-2">
                {param.placeholder}
                {param.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="file"
                id={param.name}
                accept={param.accept}
                onChange={(e) => handleFileChange(e.target.files?.[0] || null, param.name)}
                required={param.required}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-2"
              />
            </div>
            
            {file && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">{file.name}</p>
                  <p className="text-xs text-green-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFileChange(null, param.name)}
                  className="text-green-600 hover:text-green-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {fileError && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800">{fileError}</p>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            id={param.name}
            value={value}
            onChange={(e) => handleFormChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            className="form-textarea"
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            id={param.name}
            value={value}
            onChange={(e) => handleFormChange(param.name, e.target.value)}
            required={param.required}
            className="form-select"
          >
            <option value="">Select an option...</option>
            {param.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'email':
        return (
          <input
            type="email"
            id={param.name}
            value={value}
            onChange={(e) => handleFormChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            className="form-input"
          />
        );

      default: // text
        return (
          <input
            type="text"
            id={param.name}
            value={value}
            onChange={(e) => handleFormChange(param.name, e.target.value)}
            placeholder={param.placeholder}
            required={param.required}
            className="form-input"
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Webhook Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Webhook Configuration
            </h3>
            <p className="text-blue-800 mb-3">
              This tool will send data to the configured webhook endpoint when executed.
            </p>
            <div className="text-sm text-blue-700">
              <strong>Endpoint:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{tool.webhookUrl}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Configure Parameters
        </h3>
        
        <form className="space-y-6">
          {tool.parameters.map((param) => (
            <div key={param.name} className="space-y-2">
              <label 
                htmlFor={param.name}
                className="block text-sm font-medium text-gray-700"
              >
                {param.name.charAt(0).toUpperCase() + param.name.slice(1).replace(/([A-Z])/g, ' $1')}
                {param.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderFormField(param)}
              
              {param.placeholder && (
                <p className="text-xs text-gray-500">
                  {param.placeholder}
                </p>
              )}
            </div>
          ))}
        </form>

        {/* Execute Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => onExecute(fileData)}
            disabled={!isFormValid || isLoading}
            className="btn-success flex items-center space-x-2 py-3 px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Executing Workflow...</span>
              </>
            ) : (
              <>
                <span>Execute Workflow</span>
              </>
            )}
          </button>
          
          {!isFormValid && (
            <p className="mt-2 text-sm text-gray-500">
              Please fill in all required fields to execute the workflow.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Execution Result</h3>
          
          <div className={`border rounded-lg p-4 ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {result.success ? (
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Success' : 'Error'}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(result.timestamp).toLocaleString()}
              </span>
            </div>
            
            {result.success && result.data && (
              <div className="space-y-2">
                <h4 className="font-medium text-green-800">Generated Proposal:</h4>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div 
                    className="prose prose-sm max-w-none text-green-900"
                    dangerouslySetInnerHTML={{ 
                      __html: (() => {
                        let content = '';
                        if (Array.isArray(result.data)) {
                          content = result.data[0]?.data || '';
                        } else if (result.data && typeof result.data === 'object' && result.data.data) {
                          content = result.data.data || '';
                        } else {
                          content = result.data || '';
                        }
                        return typeof content === 'string' ? content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') : '';
                      })()
                    }}
                  />
                </div>
              </div>
            )}
            
            {!result.success && result.error && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-800">Error Details:</h4>
                <p className="text-red-700 bg-red-100 p-3 rounded">
                  {result.error}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
