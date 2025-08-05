"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronRight } from "lucide-react"

export default function BlueTickSettings() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Blue Tick Request</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Blue Tick Verification</h3>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Verification Status</h4>
          <p className="text-gray-600 mb-6">Request blue tick verification for your WhatsApp Business account.</p>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Request Blue Tick
          </Button>
        </div>
      </div>
    </div>
  )
} 