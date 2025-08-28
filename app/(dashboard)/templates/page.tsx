"use client";

import Body from "@/components/layout/body";
import { Trash, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import { CreateTemplateModal } from "@/components/templates/create-template-modal";
import { TemplatePreviewModal } from "@/components/templates/template-preview-modal";
import { useTemplates } from "@/context/template-provider";
import { useUser } from "@/context/user-context";

type Template = {
  id: string;
  name: string;
  language: string;
  category: string;
  status: string;
  parameter_format: string;
  components: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
    format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
    text?: string;
    buttons?: Array<{
      type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
      text: string;
      url?: string;
      phone_number?: string;
    }>;
    example?: {
      header_text?: string[];
      body_text?: string[][];
      header_handle?: string[];
    };
  }>;
  created_at?: string;
  updated_at?: string;
};

export default function TemplatesPage() {
  const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] =
    useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const { userInfo } = useUser();
  const {
    templates,
    isLoading,
    error,
    selectedWhatsAppAccountId,
    setSelectedWhatsAppAccountId,
    deleteTemplate,
  } = useTemplates();

  // Set the selected WhatsApp account ID when user info is available
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      setSelectedWhatsAppAccountId(userInfo.whatsappAccount.id);
    }
  }, [userInfo, setSelectedWhatsAppAccountId]);

  const handleDeleteTemplate = async (
    templatesToDelete: Template | Template[]
  ) => {
    if (!selectedWhatsAppAccountId) {
      console.error("No WhatsApp account selected");
      return;
    }
    const templateArray = Array.isArray(templatesToDelete)
      ? templatesToDelete
      : [templatesToDelete];
    const names = templateArray.map((t) => t.name);
    await deleteTemplate(selectedWhatsAppAccountId, names);
  };

  const handleAddTemplate = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const handlePreviewTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setSelectedTemplate(null);
  };

  const getComponentTypeColor = (type: string) => {
    switch (type) {
      case "HEADER":
        return "bg-sky-50 text-sky-700";
      case "BODY":
        return "bg-emerald-50 text-emerald-700";
      case "FOOTER":
        return "bg-violet-50 text-violet-700";
      case "BUTTONS":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const columns: MRT_ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
      Cell: ({ row }) => {
        const template = row.original;
        return (
          <div>
            <div className="font-medium text-gray-900">{template.name}</div>
            <div className="text-xs text-gray-500">ID: {template.id}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "language",
      header: "Language",
    },
    {
      accessorKey: "category",
      header: "Category",
      Cell: ({ row }) => {
        const category = row.original.category;
        return (
          <span className="capitalize text-sm text-gray-700">
            {category.toLowerCase()}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : status === "REJECTED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "components",
      header: "Components",
      Cell: ({ row }) => {
        const components = row.original.components;
        return (
          <div className="flex flex-wrap gap-1">
            {components?.map((component, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${getComponentTypeColor(
                  component.type
                )}`}
                title={`${component.type}${
                  component.format ? ` (${component.format})` : ""
                }${
                  component.buttons
                    ? ` - ${component.buttons.length} buttons`
                    : ""
                }`}
              >
                {component.type}
                {component.format && component.format !== "TEXT" && (
                  <span className="text-xs opacity-75">
                    ({component.format})
                  </span>
                )}
                {component.buttons && (
                  <span className="text-xs opacity-75">
                    ({component.buttons.length})
                  </span>
                )}
              </span>
            ))}
          </div>
        );
      },
    },
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      key: "preview",
      label: "Preview",
      icon: <Eye className="text-blue-600 size-4" />,
      onClick: async (template, closeMenu) => {
        handlePreviewTemplate(template);
        closeMenu();
      },
      className: "text-blue-600",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: async (template, closeMenu) => {
        await handleDeleteTemplate(template);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  const handleCreateTemplate = async () => {
    if (!selectedWhatsAppAccountId) {
      console.error("No WhatsApp account selected");
      return;
    }
    setIsCreateTemplateModalOpen(false);
  };

  // New: handle row click to preview template
  const handleRowClick = (template: Template) => {
    handlePreviewTemplate(template);
  };

  return (
    <Body title="Templates">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <Table
        data={templates as Template[]}
        columns={columns}
        isLoading={isLoading}
        actionMenuItems={actionMenuItems}
        onAddItem={handleAddTemplate}
        addButtonLabel="Create Template"
        searchPlaceholder="Search templates..."
        deleteButtonLabel="Delete Template"
        onDelete={handleDeleteTemplate}
        // Pass the row click handler to Table
        onRowClick={handleRowClick}
      />

      <CreateTemplateModal
        open={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />

      <TemplatePreviewModal
        open={isPreviewModalOpen}
        onClose={handleClosePreview}
        template={selectedTemplate}
      />
    </Body>
  );
}
