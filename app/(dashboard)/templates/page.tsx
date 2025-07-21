"use client";

import Body from "@/components/layout/body";
import { FileText, Edit, Trash, Copy, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";
import { CreateTemplateModal } from "@/components/templates/create-template-modal";
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
  const { userInfo } = useUser();
  const {
    templates,
    isLoading,
    error,
    selectedWhatsAppAccountId,
    setSelectedWhatsAppAccountId,
    createTemplate,
    deleteTemplate,
  } = useTemplates();

  // Set the selected WhatsApp account ID when user info is available
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      setSelectedWhatsAppAccountId(userInfo.whatsappAccount.id);
    }
  }, [userInfo, setSelectedWhatsAppAccountId]);

  const handleDeleteTemplate = async (template: Template) => {
    if (!selectedWhatsAppAccountId) {
      console.error("No WhatsApp account selected");
      return;
    }
    console.log(template, "template");
    await deleteTemplate(selectedWhatsAppAccountId, template.name);
  };

  const handleAddTemplate = () => {
    setIsCreateTemplateModalOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    console.log("Edit template", template);
    // Note: WhatsApp API doesn't support template updates
    // This would typically involve creating a new template
  };

  const handleDuplicateTemplate = async (template: Template) => {
    if (!selectedWhatsAppAccountId) {
      console.error("No WhatsApp account selected");
      return;
    }

    // Create a new template based on the existing one
    const newTemplateData = {
      name: `${template.name}_copy`,
      language: template.language,
      category: template.category,
      components: template.components,
    };

    await createTemplate(selectedWhatsAppAccountId, newTemplateData);
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
                className={`px-2 py-0.5 text-xs bg-gray-100 rounded-full ${
                  component.type === "HEADER"
                    ? "bg-blue-100 text-blue-800"
                    : component.type === "BODY"
                    ? "bg-green-100 text-green-800"
                    : component.type === "FOOTER"
                    ? "bg-teal-400/20 text-gray-800"
                    : "bg-gray-100 text-gray-800"
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

    // The template data will be passed from the modal
    setIsCreateTemplateModalOpen(false);
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
      />

      <CreateTemplateModal
        open={isCreateTemplateModalOpen}
        onClose={() => setIsCreateTemplateModalOpen(false)}
        onCreateTemplate={handleCreateTemplate}
      />
    </Body>
  );
}
