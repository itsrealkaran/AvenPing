"use client"

import React, { useState } from "react"
import { ChevronRight, Calendar, MoreVertical, ArrowUpDown, Filter, Menu, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "@/components/ui/table"
import { MRT_ColumnDef } from "material-react-table"

interface PaymentRecord {
  id: string
  date: string
  amount: string
  method: string
  status: "Paid" | "Pending" | "Failed"
}

export default function PaymentHistorySettings() {
  const [sortBy, setSortBy] = useState<string>("date")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Dummy payment data
  const payments: PaymentRecord[] = Array.from({ length: 10 }, (_, index) => ({
    id: `payment-${index + 1}`,
    date: "May 15, 2023",
    amount: "$87",
    method: "Credit Card",
    status: "Paid" as const
  }))

  // Define columns for the table
  const columns: MRT_ColumnDef<PaymentRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{row.original.date}</span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      Cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">{row.original.amount}</span>
      ),
    },
    {
      accessorKey: "method",
      header: "Method",
      Cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.method}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ row }) => {
        const status = row.original.status
        const getStatusBadge = (status: string) => {
          const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
          switch (status) {
            case "Paid":
              return `${baseClasses} bg-green-100 text-green-800`
            case "Pending":
              return `${baseClasses} bg-yellow-100 text-yellow-800`
            case "Failed":
              return `${baseClasses} bg-red-100 text-red-800`
            default:
              return `${baseClasses} bg-gray-100 text-gray-800`
          }
        }
        return <span className={getStatusBadge(status)}>{status}</span>
      },
    },
  ]

  // Define action menu items
  const actionMenuItems = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row: PaymentRecord) => {
        console.log("View payment details:", row.id)
      },
    },
    {
      key: "download",
      label: "Download Invoice",
      icon: <Download className="w-4 h-4" />,
      onClick: (row: PaymentRecord) => {
        console.log("Download invoice for:", row.id)
      },
    },
  ]

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Payment History</span>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
        </div>
        
        <Table
          data={payments}
          columns={columns}
          actionMenuItems={actionMenuItems}
          enableRowSelection={false}
          enableColumnResizing={false}
          enableColumnOrdering={false}
          enableGlobalFilter={false}
          enableColumnFilters={false}
          enablePagination={true}
          enableSorting={true}
          enableRowActions={true}
          density="comfortable"
          tableHeight="600px"
          searchPlaceholder="Search payments..."
        />
      </div>
    </div>
  )
} 