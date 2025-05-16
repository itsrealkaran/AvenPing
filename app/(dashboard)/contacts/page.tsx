"use client";

import Body from "@/components/layout/body";
import { Users, Edit, Trash, Pause, Play, Plus } from "lucide-react";
import React, { useState } from "react";
import Table, { ActionMenuItem } from "@/components/ui/table";
import { MRT_ColumnDef } from "material-react-table";

type Contact = {
  id: string;
  name: string;
  phone: string;
  group: string;
  status: string;
  createdAt: string;
};

export default function ContactsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "+91 9876543210",
      group: "Friends",
      status: "Active",
      createdAt: "2023-05-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "+91 9876543211",
      group: "Family",
      status: "Active",
      createdAt: "2023-05-16T11:20:00Z",
    },
    {
      id: "3",
      name: "Mike Johnson",
      phone: "+91 9876543212",
      group: "Work",
      status: "Inactive",
      createdAt: "2023-05-17T09:15:00Z",
    },
    {
      id: "4",
      name: "Sarah Williams",
      phone: "+91 9876543213",
      group: "Friends",
      status: "Active",
      createdAt: "2023-05-18T14:45:00Z",
    },
  ]);

  const handleDeleteContact = (contact: Contact) => {
    setContacts(contacts.filter((c) => c.id !== contact.id));
  };

  const handleAddContact = () => {
    console.log("Add contact");
    // Implement your add contact logic here
  };

  const handleEditContact = (contact: Contact) => {
    console.log("Edit contact", contact);
    // Implement your edit contact logic here
  };

  const handleToggleStatus = (contact: Contact) => {
    const newStatus = contact.status === "Active" ? "Inactive" : "Active";
    setContacts(
      contacts.map((c) =>
        c.id === contact.id ? { ...c, status: newStatus } : c
      )
    );
  };

  const columns: MRT_ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      accessorKey: "group",
      header: "Group",
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const value = row.original.status;
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              value === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        );
      },
    },
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

  return (
    <Body icon={Users} title="Contacts">
      <Table
        data={contacts}
        columns={columns}
        isLoading={isLoading}
        actionMenuItems={actionMenuItems}
        onAddItem={handleAddContact}
        addButtonLabel="Add Contact"
        searchPlaceholder="Search contacts..."
        tableHeight="340px"
      />
    </Body>
  );
}
