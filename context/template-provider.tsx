"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";

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
  type: "HEADER" | "BODY" | "FOOTER";
  format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
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
  fetchTemplates: (whatsAppAccountId: string) => Promise<Template[]>;
  createTemplate: (
    whatsAppAccountId: string,
    templateData: any
  ) => Promise<void>;
  deleteTemplate: (
    whatsAppAccountId: string,
    templateNames: string[]
  ) => Promise<void>; // updated
  updateTemplate: (
    whatsAppAccountId: string,
    templateId: string,
    templateData: any
  ) => Promise<void>;
  refreshTemplates: () => Promise<void>;
  isRefreshing: boolean;
  clearError: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(
  undefined
);

interface TemplateProviderProps {
  children: ReactNode;
}

export function TemplateProvider({ children }: TemplateProviderProps) {
  const [selectedWhatsAppAccountId, setSelectedWhatsAppAccountId] = useState<
    string | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const fetchTemplates = async (
    whatsAppAccountId: string
  ): Promise<Template[]> => {
    if (!whatsAppAccountId) return [];

    try {
      const response = await fetch(`/api/whatsapp/templates`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch templates");
      }

      const data = await response.json();

      // Transform the Facebook API response to our Template format
      const transformedTemplates: Template[] =
        data.data?.map((template: any) => ({
          id: template.id,
          name: template.name,
          language: template.language,
          category: template.category,
          status: template.status,
          components: template.components || [],
          created_at: template.created_at,
          updated_at: template.updated_at,
        })) || [];

      return transformedTemplates;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch templates";
      toast.error(errorMessage);
      return [];
    }
  };

  const {
    data: templates = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["templates", selectedWhatsAppAccountId],
    queryFn: () => fetchTemplates(selectedWhatsAppAccountId!),
    enabled: !!selectedWhatsAppAccountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const createTemplateMutation = useMutation({
    mutationFn: async ({
      whatsAppAccountId,
      templateData,
    }: {
      whatsAppAccountId: string;
      templateData: any;
    }) => {
      const response = await fetch(`/api/whatsapp/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create template");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success(
        "Template created successfully! Please wait for approval from Meta."
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create template");
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async ({
      whatsAppAccountId,
      templateNames,
    }: {
      whatsAppAccountId: string;
      templateNames: string[];
    }) => {
      const namesParam = templateNames.join(",");
      const response = await fetch(
        `/api/whatsapp/templates?names=${encodeURIComponent(namesParam)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete template(s)");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template(s) deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete template(s)");
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({
      whatsAppAccountId,
      templateId,
      templateData,
    }: {
      whatsAppAccountId: string;
      templateId: string;
      templateData: any;
    }) => {
      const response = await fetch(
        `/api/whatsapp/templates/${whatsAppAccountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templateId, ...templateData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update template");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast.success("Template updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update template");
    },
  });

  const createTemplate = async (
    whatsAppAccountId: string,
    templateData: any
  ) => {
    await createTemplateMutation.mutateAsync({
      whatsAppAccountId,
      templateData,
    });
  };

  const deleteTemplate = async (
    whatsAppAccountId: string,
    templateNames: string[]
  ) => {
    await deleteTemplateMutation.mutateAsync({
      whatsAppAccountId,
      templateNames,
    });
  };

  const updateTemplate = async (
    whatsAppAccountId: string,
    templateId: string,
    templateData: any
  ) => {
    await updateTemplateMutation.mutateAsync({
      whatsAppAccountId,
      templateId,
      templateData,
    });
  };

  const refreshTemplates = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["templates"] });
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearError = () => {
    // This would need to be implemented if you want to clear errors
  };

  const value: TemplateContextType = {
    templates,
    isLoading,
    error: error?.message || null,
    selectedWhatsAppAccountId,
    setSelectedWhatsAppAccountId,
    fetchTemplates,
    createTemplate,
    deleteTemplate,
    updateTemplate,
    refreshTemplates,
    isRefreshing,
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
    throw new Error("useTemplates must be used within a TemplateProvider");
  }
  return context;
}
