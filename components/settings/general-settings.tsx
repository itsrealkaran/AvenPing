"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Phone, Link, Trash2, ChevronRight } from "lucide-react"

interface GeneralSettingsProps {
  optOutStatus: boolean
  setOptOutStatus: (status: boolean) => void
  whatsappConnected: boolean
  setWhatsappConnected: (connected: boolean) => void
}

export default function GeneralSettings({ 
  optOutStatus, 
  setOptOutStatus, 
  whatsappConnected, 
  setWhatsappConnected 
}: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">General</span>
      </div>

      {/* Opt-out Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Opt-out Status</h3>
            <p className="text-gray-600 text-sm">
              Enable to allow users to opt out of receiving messages. If enabled, users can reply with any of the defined keywords to stop receiving messages.
            </p>
          </div>
          <div className="ml-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={optOutStatus}
                onChange={(e) => setOptOutStatus(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {optOutStatus ? "on" : "off"}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* WhatsApp Connection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">WhatsApp Connection</h3>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            {whatsappConnected ? "Connected" : "Not Connected"}
          </h4>
          <p className="text-gray-600 mb-6">
            {whatsappConnected 
              ? "Your WhatsApp Business Account is connected and ready to use."
              : "Connect your WhatsApp Business Account"
            }
          </p>
          <Button 
            variant={whatsappConnected ? "outline" : "default"}
            onClick={() => setWhatsappConnected(!whatsappConnected)}
          >
            <Link className="h-4 w-4 mr-2" />
            {whatsappConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-medium">Delete My Account</p>
            <p className="text-gray-600 text-sm mt-1">Permanently delete your account and all associated data</p>
          </div>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete My Account
          </Button>
        </div>
        <p className="text-gray-500 text-xs mt-3">Note: This is a destructive action, proceed with caution</p>
      </div>
    </div>
  )
} 