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
  components: any[];
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

  const columns: MRT_ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
    },
    {
      accessorKey: "language",
      header: "Language",
    },
    {
      accessorKey: "category",
      header: "Category",
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
                className={`px-2 py-0.5 text-xs bg-gray-50 rounded-full ${
                  component.type === "HEADER"
                    ? "bg-sky-50 text-sky-700"
                    : component.type === "BODY"
                    ? "bg-emerald-50 text-emerald-700"
                    : component.type === "FOOTER"
                    ? "bg-violet-50 text-violet-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {component.type}
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
        data={templates}
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
