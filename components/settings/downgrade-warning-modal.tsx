"use client"

import React from "react"
import { X, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DowngradeWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  planName: string
  currentPlanName: string
  period: "month" | "year"
}

const DowngradeWarningModal: React.FC<DowngradeWarningModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  currentPlanName,
  period
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">Plan Downgrade Warning</h2>
            <p className="text-sm text-gray-600 mt-1">
              You're about to downgrade from {currentPlanName} to {planName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Warning Content */}
        <div className="p-6 space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-orange-800 mb-2">
                  Important: This action cannot be undone immediately
                </h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Your current plan features will be reduced</li>
                  <li>• Some functionality may become unavailable</li>
                  <li>• You'll need to upgrade again to restore features</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                  What happens next?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your plan will change to {planName} ({period}ly)</li>
                  <li>• Changes take effect immediately</li>
                  <li>• You can upgrade again at any time</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Are you sure you want to proceed with downgrading to the {planName} plan?
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm"
            >
              Yes, Downgrade to {planName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DowngradeWarningModal
