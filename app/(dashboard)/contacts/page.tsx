"use client";

import Body from "@/components/layout/body";
import { Edit, Trash, Pause, Play, FileUp, Download } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem, ToolbarAction } from "@/components/ui/table";
import { MRT_ColumnDef, MRT_Row } from "material-react-table";
import { useContacts, Contact } from "@/context/contact-provider";
import { useUser } from "@/context/user-context";
import AddContactModal from "@/components/contacts/add-contact-modal";
import ImportContactsModal from "@/components/contacts/import-contacts-modal";
import { normalizePhoneNumber } from "@/lib/utils";

// Utility function to convert contacts to CSV format
const exportContactsToCSV = (contacts: Contact[]) => {
  // Define CSV headers
  const headers = ['Name', 'Phone Number', 'Status', 'Group', 'Created At', 'Has Conversation'];
  
  // Convert contacts to CSV rows
  const rows = contacts.map(contact => [
    contact.name || 'No name',
    normalizePhoneNumber(contact.phoneNumber),
    contact.status || 'N/A',
    contact.group || 'N/A',
    new Date(contact.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    contact.hasConversation ? 'Yes' : 'No'
  ]);
  
  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  return csvContent;
};

// Utility function to download CSV file
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export default function ContactsPage() {
  const { contacts, isLoading, error, createContact, updateContact, deleteContacts, isCreating, isUpdating, isDeleting, createError, updateError, deleteError, attributes } = useContacts();
  const { userInfo } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleDeleteContact = (contact: Contact) => {
    deleteContacts([contact.id]);
  };

  const handleDeleteContacts = (contacts: Contact[]) => {
    deleteContacts(contacts.map((c) => c.id));
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowAddModal(true);
  };

  const handleCreateContact = async (data: { name: string; phoneNumber: string; attributes: { name: string; value: string }[] }) => {
    if (editingContact) {
      // Update existing contact
      await updateContact({
        id: editingContact.id,
        name: data.name,
        phoneNumber: data.phoneNumber,
        attributes: data.attributes,
      });
    } else {
      // Create new contact
      if (!userInfo?.whatsappAccount?.phoneNumbers?.[0]?.id) {
        throw new Error("No phone number available");
      }
      
      await createContact({
        name: data.name,
        phoneNumber: data.phoneNumber,
        phoneNumberId: userInfo.whatsappAccount.phoneNumbers[0].id,
        attributes: data.attributes,
      });
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const handleToggleStatus = (contact: Contact) => {
    const newStatus = contact.status === "Active" ? "Inactive" : "Active";
    // setContacts(
    //   contacts.map((c) =>
    //     c.id === contact.id ? { ...c, status: newStatus } : c
    //   )
    // );
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingContact(null);
  };

  const handleImportContacts = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleExportContacts = () => {
    if (contacts?.length === 0) {
      alert('Please select at least one contact to export.');
      return;
    }

    try {
      const csvContent = exportContactsToCSV(contacts || []);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `contacts_export_${timestamp}.csv`;
      
      downloadCSV(csvContent, filename);
      
      console.log(`Exported ${contacts?.length} contacts to ${filename}`);
    } catch (error) {
      console.error('Error exporting contacts:', error);
      alert('Failed to export contacts. Please try again.');
    }
  };

  const columns: MRT_ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: "Name",
      Cell: ({ row }) => row.original.name || "No name",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "group",
      header: "Group",
    },
    {
      accessorKey: "source",
      header: "Source",
      Cell: ({ row }) => {
        const value = row.original.source?.replace(/_/g, ' ');
        return value || "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const value = row.original.status;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "UNDELIVERED"
                ? "bg-red-100 text-red-800"
                : value === "UNREAD"
                ? "bg-amber-100 text-amber-800" 
                : value === "READ"
                ? "bg-green-100 text-green-800"
                : value === "REPLIED"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {value || "Unknown"}
          </span>
        );
      },
    },
    ...(attributes || []).map((attribute) => ({
      accessorKey: attribute.name,
      header: attribute.name,
      Cell: ({ row }: { row: MRT_Row<Contact> }) => {
        const value = row.original.attributeValues?.find((av) => av.name === attribute.name)?.value;
        return value || "N/A";
      },
    })),
    {
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
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
      onClick: (contact, closeMenu) => {
        handleEditContact(contact);
        closeMenu();
      },
    },
    {
      key: "toggle",
      label: (row: Contact) =>
        row.status === "Active" ? "Deactivate" : "Activate",
      icon: (row: Contact) =>
        row.status === "Active" ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4" />
        ),
      onClick: (contact, closeMenu) => {
        handleToggleStatus(contact);
        closeMenu();
      },
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash className="text-red-600 size-4" />,
      onClick: (contact, closeMenu) => {
        handleDeleteContact(contact);
        closeMenu();
      },
      className: "text-red-600",
    },
  ];

  const toolbarActions: ToolbarAction<Contact>[] = [
    {
      key: "import",
      label: "Import",
      icon: Download,
      onClick: () => {
        handleImportContacts();
      },
    },
    {
      key: "export",
      label: "Export",
      icon: FileUp,
      onClick: () => {
        handleExportContacts();
      },
    }
  ];

  return (
    <>
      <Body title="Contacts">
        <Table
          data={contacts || []}
          columns={columns}
          isLoading={isLoading}
          actionMenuItems={actionMenuItems}
          onAddItem={handleAddContact}
          addButtonLabel="Add Contact"
          onDelete={handleDeleteContacts}
          deleteButtonLabel="Delete Contact"
          searchPlaceholder="Search contacts..."
          toolbarActions={toolbarActions}
        />
      </Body>
      
      <AddContactModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSubmit={handleCreateContact}
        isLoading={editingContact ? isUpdating : isCreating}
        editContact={editingContact}
      />
      
      <ImportContactsModal
        isOpen={showImportModal}
        onClose={handleCloseImportModal}
      />
    </>
  );
}
