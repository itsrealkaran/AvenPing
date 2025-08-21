"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Loader2, BellOff } from "lucide-react"
import { useSettings } from "@/context/settings-provider"
import { toast } from "sonner"

export default function NotificationSettings() {
  const {
    userSettings,
    isLoading,
    error,
    updateNotificationSetting,
    updateNotificationSettings,
  } = useSettings()

  // Local state for the 4 notification types
  const [notifications, setNotifications] = useState({
    chats: true,
    campaigns: true,
    planExpiry: true,
    systemUpdates: true,
  })

  // Sync local state with context when userSettings change
  useEffect(() => {
    if (userSettings?.notificationSettings) {
      const settingsMap = userSettings.notificationSettings.reduce((acc, setting) => {
        acc[setting.notificationType] = setting.isEnabled
        return acc
      }, {} as Record<string, boolean>)
      
      // Update local state with context data, preserving the 4 notification types
      setNotifications(prev => ({
        chats: settingsMap.chats ?? prev.chats,
        campaigns: settingsMap.campaigns ?? prev.campaigns,
        planExpiry: settingsMap.planExpiry ?? prev.planExpiry,
        systemUpdates: settingsMap.systemUpdates ?? prev.systemUpdates,
      }))
    }
  }, [userSettings])

  const handleNotificationToggle = async (key: string, enabled: boolean) => {
    try {
      // Update local state immediately for better UX
      setNotifications(prev => ({ ...prev, [key]: enabled }))
      
      // Update in context/database
      await updateNotificationSetting(key, enabled)
      
      toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${enabled ? 'enabled' : 'disabled'}`)
    } catch (error) {
      // Revert local state on error
      setNotifications(prev => ({ ...prev, [key]: !enabled }))
      toast.error(`Failed to update ${key} notification setting`)
      console.error('Error updating notification setting:', error)
    }
  }

  const handleResetToDefaults = async () => {
    try {
      const defaultSettings = [
        { notificationType: 'chats', isEnabled: true },
        { notificationType: 'campaigns', isEnabled: true },
        { notificationType: 'planExpiry', isEnabled: true },
        { notificationType: 'systemUpdates', isEnabled: true },
      ]
      
      await updateNotificationSettings(defaultSettings)
      
      // Update local state
      setNotifications({
        chats: true,
        campaigns: true,
        planExpiry: true,
        systemUpdates: true,
      })
      
      toast.success('Notification settings reset to defaults')
    } catch (error) {
      toast.error('Failed to reset notification settings')
      console.error('Error resetting notification settings:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>Settings</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Notifications</span>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-sm text-gray-500 mb-6">
          <span>Settings</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Notifications</span>
        </div>
        
        <div className="text-center py-8 text-red-500">
          <p>Error loading notification settings: {error.message}</p>
        </div>
      </div>
    )
  }

  // Check if user has opted out of all communications
  const isOptedOut = userSettings?.isOptOutSelected || false

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Notifications</span>
      </div>

      {/* Opt-out Warning */}
      {isOptedOut && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Communications Opted Out</p>
              <p className="text-sm text-yellow-700">
                You have opted out of all communications. Notification preferences are disabled until you opt back in.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-600">
              Choose which types of notifications you want to receive
            </p>
          </div>
          <button
            onClick={handleResetToDefaults}
            disabled={isOptedOut}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to Defaults
          </button>
        </div>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <p className="text-sm text-gray-600">
                  Receive notifications for {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toLowerCase()).toLowerCase()}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationToggle(key, e.target.checked)}
                  disabled={isOptedOut}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 