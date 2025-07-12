'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  components: TemplateComponent[];
  created_at?: string;
  updated_at?: string;
}

interface TemplateComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  text?: string;
  example?: {
    header_text?: string[];
    body_text?: string[][];
  };
}

interface TemplateContextType {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  selectedWhatsAppAccountId: string | null;
  setSelectedWhatsAppAccountId: (id: string | null) => void;
  fetchTemplates: (whatsAppAccountId: string) => Promise<void>;
  createTemplate: (whatsAppAccountId: string, templateData: any) => Promise<void>;
  deleteTemplate: (whatsAppAccountId: string, templateId: string) => Promise<void>;
  updateTemplate: (whatsAppAccountId: string, templateId: string, templateData: any) => Promise<void>;
  clearError: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

interface TemplateProviderProps {
  children: ReactNode;
}

export function TemplateProvider({ children }: TemplateProviderProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWhatsAppAccountId, setSelectedWhatsAppAccountId] = useState<string | null>(null);

  const clearError = () => setError(null);

  const fetchTemplates = async (whatsAppAccountId: string) => {
    if (!whatsAppAccountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/whatsapp/templates`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch templates');
      }

      const data = await response.json();
      
      // Transform the Facebook API response to our Template format
      const transformedTemplates: Template[] = data.data?.map((template: any) => ({
        id: template.id,
        name: template.name,
        language: template.language,
        category: template.category,
        status: template.status,
        components: template.components || [],
        created_at: template.created_at,
        updated_at: template.updated_at,
      })) || [];

      setTemplates(transformedTemplates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (whatsAppAccountId: string, templateData: any) => {
    if (!whatsAppAccountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/whatsapp/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create template');
      }

      const data = await response.json();
      
      // Refresh templates after creation
      await fetchTemplates(whatsAppAccountId);
      
      toast.success('Template created successfully! Please wait for approval from Meta.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (whatsAppAccountId: string, templateName: string) => {
    if (!whatsAppAccountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/whatsapp/templates?name=${templateName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete template');
      }

      // Remove template from local state
      setTemplates(prev => prev.filter(template => template.name !== templateName));
      
      toast.success('Template deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (whatsAppAccountId: string, templateId: string, templateData: any) => {
    if (!whatsAppAccountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/whatsapp/templates/${whatsAppAccountId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId, ...templateData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update template');
      }

      // Refresh templates after update
      await fetchTemplates(whatsAppAccountId);
      
      toast.success('Template updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch templates when selectedWhatsAppAccountId changes
  useEffect(() => {
    if (selectedWhatsAppAccountId) {
      fetchTemplates(selectedWhatsAppAccountId);
    }
  }, [selectedWhatsAppAccountId]);

  const value: TemplateContextType = {
    templates,
    isLoading,
    error,
    selectedWhatsAppAccountId,
    setSelectedWhatsAppAccountId,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate,
    clearError,
  };

  return (
    <TemplateContext.Provider value={value}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplates() {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error('useTemplates must be used within a TemplateProvider');
  }
  return context;
} 