"use client"

import React from "react"
import { ChevronRight } from "lucide-react"

export default function PaymentHistorySettings() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Payment History</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <p className="text-gray-600 mb-6">View your payment history and invoices.</p>
        {/* Add payment history content here */}
        <div className="text-center py-8 text-gray-500">
          <p>Payment history features coming soon...</p>
        </div>
      </div>
    </div>
  )
} 