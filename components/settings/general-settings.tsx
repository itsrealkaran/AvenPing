"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Link, Trash2, ChevronRight, Loader2 } from "lucide-react"
import { useUser } from "@/context/user-context"
import axios from "axios"
import { toast } from "sonner"

interface GeneralSettingsProps {
  optOutStatus: boolean
  setOptOutStatus: (status: boolean) => void
}

export default function GeneralSettings({ 
  optOutStatus, 
  setOptOutStatus
}: GeneralSettingsProps) {
  const { userInfo, hasWhatsAppAccount, isLoading } = useUser()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const handleConnectWhatsApp = async () => {
    setIsConnecting(true)
    
    try {
      //@ts-ignore
      FB.login(
        (response: any) => {
          if (response.authResponse) {
            console.log("Logged in as:", response.authResponse)
            //@ts-ignore
            FB.api("/me", { fields: "name, email" }, (userInfo) => {
              console.log(
                "Logged in as:",
                userInfo.name,
                "Email:",
                userInfo.email
              )
            })

            axios
              .post("/api/whatsapp", {
                code: response.authResponse.code,
              })
              .then((res) => {
                console.log(res.data)
                toast.success("WhatsApp connected successfully!")
                // Refresh the page to update the user context
                window.location.reload()
              })
              .catch((error) => {
                console.error("Error connecting WhatsApp:", error)
                toast.error("Failed to connect WhatsApp. Please try again.")
              })
              .finally(() => {
                setIsConnecting(false)
              })
          } else {
            console.log("User cancelled login or did not fully authorize.")
            toast.error("WhatsApp connection was cancelled.")
            setIsConnecting(false)
          }
        },
        {
          config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
          response_type: "code",
          override_default_response_type: true,
          scope:
            "whatsapp_business_management,whatsapp_business_messaging,business_management",
        }
      )
    } catch (error) {
      console.error("Error connecting WhatsApp:", error)
      toast.error("Failed to connect WhatsApp. Please try again.")
      setIsConnecting(false)
    }
  }

  const handleDisconnectWhatsApp = async () => {
    setIsDisconnecting(true)
    
    try {
      // Call API to disconnect WhatsApp account
      await axios.delete("/api/whatsapp")
      toast.success("WhatsApp disconnected successfully!")
      // Refresh the page to update the user context
      window.location.reload()
    } catch (error) {
      console.error("Error disconnecting WhatsApp:", error)
      toast.error("Failed to disconnect WhatsApp. Please try again.")
    } finally {
      setIsDisconnecting(false)
    }
  }

  const getWhatsAppStatus = () => {
    if (isLoading) return "loading"
    if (hasWhatsAppAccount && userInfo?.whatsappAccount?.phoneNumbers && userInfo.whatsappAccount.phoneNumbers.length > 0) {
      return "connected"
    }
    return "not_connected"
  }

  const getPhoneNumberInfo = () => {
    if (userInfo?.whatsappAccount?.phoneNumbers && userInfo.whatsappAccount.phoneNumbers.length > 0) {
      const phoneNumber = userInfo.whatsappAccount.phoneNumbers[0]
      return {
        number: phoneNumber.phoneNumber,
        name: phoneNumber.name,
        isRegistered: phoneNumber.isRegistered,
        verificationStatus: phoneNumber.codeVerificationStatus
      }
    }
    return null
  }

  const whatsAppStatus = getWhatsAppStatus()
  const phoneNumberInfo = getPhoneNumberInfo()

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
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
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
          {whatsAppStatus === "loading" ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {whatsAppStatus === "connected" ? "Connected" : "Not Connected"}
              </h4>
              
              {whatsAppStatus === "connected" && phoneNumberInfo && (
                <div className="mb-4 text-sm text-gray-600">
                  <p className="font-medium">{phoneNumberInfo.name}</p>
                  <p>{phoneNumberInfo.number}</p>
                  <p className={`text-xs ${phoneNumberInfo.isRegistered ? 'text-green-600' : 'text-amber-600'}`}>
                    {phoneNumberInfo.isRegistered ? 'Registered' : 'Not Registered'}
                  </p>
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                {whatsAppStatus === "connected" 
                  ? "Your WhatsApp Business Account is connected and ready to use."
                  : "Connect your WhatsApp Business Account to start sending messages and managing campaigns."
                }
              </p>
              
              <Button 
                variant={whatsAppStatus === "connected" ? "outline" : "default"}
                onClick={whatsAppStatus === "connected" ? handleDisconnectWhatsApp : handleConnectWhatsApp}
                disabled={isConnecting || isDisconnecting}
              >
                {isConnecting || isDisconnecting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Link className="h-4 w-4 mr-2" />
                )}
                {isConnecting ? "Connecting..." : 
                 isDisconnecting ? "Disconnecting..." :
                 whatsAppStatus === "connected" ? "Disconnect" : "Connect"}
              </Button>
            </>
          )}
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