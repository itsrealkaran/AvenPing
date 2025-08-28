"use client"

import React, { useState } from "react"
import { ChevronRight, Calendar, MoreVertical, ArrowUpDown, Filter, Menu, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Table from "@/components/ui/table"
import { MRT_ColumnDef } from "material-react-table"
import { useSettings } from "@/context/settings-provider"

interface PaymentRecord {
  id: string
  createdAt: string
  amount: string
  planName: string
  period: string
}

export default function PaymentHistorySettings() {
  const { paymentHistory, isPaymentHistoryLoading, paymentHistoryError } = useSettings();

  // Define columns for the table
  const columns: MRT_ColumnDef<PaymentRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {new Date(row.original.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      Cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-900">{Number(row.original.amount) / 100}</span>
      ),
    },
    {
      accessorKey: "planName",
      header: "Plan",
      Cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.original.planName}</span>
      ),
    },
    {
      accessorKey: "period",
      header: "Period",
      Cell: ({ row }) => {
        const status = row.original.period
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
          data={paymentHistory?.subscriptions || []}
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