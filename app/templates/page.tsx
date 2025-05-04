"use client";

import Body from "@/components/ui/body";
import { FileText, Edit, Trash, Copy, Plus } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";

type Template = {
  id: string;
  name: string;
  type: string;
  category: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
};

export default function TemplatesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Welcome Message",
      type: "SMS",
      category: "Onboarding",
      variables: ["name", "company"],
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Order Confirmation",
      type: "WhatsApp",
      category: "Transactional",
      variables: ["name", "order_id", "amount"],
      createdAt: "2023-05-16T11:20:00Z",
      updatedAt: "2023-06-01T09:15:00Z",
    },
    {
      id: "3",
      name: "Appointment Reminder",
      type: "SMS",
      category: "Notification",
      variables: ["name", "date", "time", "location"],
      createdAt: "2023-05-17T09:15:00Z",
      updatedAt: "2023-05-17T09:15:00Z",
    },
    {
      id: "4",
      name: "Promotional Offer",
      type: "WhatsApp",
      category: "Marketing",
      variables: ["name", "discount", "expiry_date"],
      createdAt: "2023-05-18T14:45:00Z",
      updatedAt: "2023-07-10T16:30:00Z",
    },
  ]);

  const handleDeleteTemplate = (template: Template) => {
    setTemplates(templates.filter((t) => t.id !== template.id));
  };

  const handleAddTemplate = () => {
    console.log("Add template");
    // Implement your add template logic here
  };

  const handleEditTemplate = (template: Template) => {
    console.log("Edit template", template);
    // Implement your edit template logic here
  };

  const handleDuplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTemplates([...templates, newTemplate]);
  };

  const columns: MRT_ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: "Template Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      Cell: ({ row }) => {
        const value = row.original.type;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "SMS"
                ? "bg-blue-100 text-blue-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "variables",
      header: "Variables",
      Cell: ({ row }) => {
        const variables = row.original.variables;
        return (
          <div className="flex flex-wrap gap-1">
            {variables.map((variable, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-gray-100 rounded-full"
              >
                {variable}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Last Updated",
      Cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
  ];

  const actionMenuItems: ActionMenuItem[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <Edit className="size-4" />,
      onClick: (template, closeMenu) => {
        handleEditTemplate(template);
        closeMenu();
      },
    },
    {
      key: "duplicate",
      label: "Duplicate",
      icon: <Copy className="size-4" />,
      onClick: (template, closeMenu) => {
        handleDuplicateTemplate(template);
        closeMenu();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: (template, closeMenu) => {
        handleDeleteTemplate(template);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  return (
    <Body icon={FileText} title="Templates">
      <Table
        data={templates}
        columns={columns}
        isLoading={isLoading}
        actionMenuItems={actionMenuItems}
        onAddItem={handleAddTemplate}
        addButtonLabel="Create Template"
        searchPlaceholder="Search templates..."
        tableHeight="340px"
      />
    </Body>
  );
}
