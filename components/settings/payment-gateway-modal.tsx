"use client"

import React, { useState } from "react"
import { X, CreditCard, Shield, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { initiateRazorpayPayment } from "@/lib/razorpay-utils"
import { useUser } from "@/context/user-context"
import { toast } from "sonner"

interface PaymentGatewayModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPeriod: "month" | "year"
  region: "US" | "IND" | "ASIA"
  price: number
  currency: string
  isAddon?: boolean
  months?: number
  quantity?: number
  isFromSignup?: boolean
}

interface PaymentGateway {
  id: "stripe" | "razorpay"
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
  recommended?: boolean
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  planName,
  planPeriod,
  region,
  price,
  currency,
  isAddon = false,
  months = 1,
  quantity = 1,
  isFromSignup = false
}) => {
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "razorpay" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  console.log(price, currency)

  const paymentGateways: PaymentGateway[] = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Secure global payments with credit cards",
      icon: <CreditCard className="w-6 h-6" />,
      features: [
        "Accept all major credit cards",
        "Global payment processing",
        "PCI DSS compliant",
        "Real-time fraud detection",
        "Instant payment confirmation"
      ],
      recommended: region === "US" || region === "ASIA"
    },
    {
      id: "razorpay",
      name: "Razorpay",
      description: "India's leading payment gateway",
      icon: <Shield className="w-6 h-6" />,
      features: [
        "UPI, cards, net banking",
        "Zero transaction fees",
        "Instant settlements",
        "Multi-currency support",
        "Advanced analytics"
      ],
      recommended: region === "IND"
    }
  ]

  const { userInfo } = useUser()

  const handlePayment = async () => {
    if (!selectedGateway) return

    setIsProcessing(true)
    try {
      if (selectedGateway === "stripe") {
        const response = await fetch(`/api/subscription/stripe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planName,
            planPeriod: planPeriod === "month" ? "MONTHLY" : "YEARLY",
            region: region,
            isAddon,
            months,
            quantity,
            redirectUrl: isFromSignup ? "/signup" : undefined
          }),
        })

        const data = await response.json()

        if (response.ok) {
          // Redirect to Stripe checkout
          window.location.href = data.url
        } else {
          throw new Error(data.message || "Payment initialization failed")
        }
      } else if (selectedGateway === "razorpay") {
        const razorpayPlanPeriod = planPeriod === "month" ? "MONTHLY" : "YEARLY"
        
        await initiateRazorpayPayment(
          planName,
          razorpayPlanPeriod,
          region,
          userInfo?.email,
          userInfo?.name,
          (response) => {
            console.log("Payment successful:", response)
            fetch("/api/subscription/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature
              })
            }).then(() => {
              toast.success("Payment successful")
              window.location.reload()
            }).catch((error) => {
              console.error("Payment verification failed:", error)
              toast.error("Payment verification failed. Please try again.")
            })
            toast.success("Payment successful")
          },
          (error) => {
            console.error("Payment failed:", error)
            toast.error("Payment failed. Please try again.")
          },
          isAddon,
          months,
          quantity
        )
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("Payment initialization failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Choose Payment Method</h2>
            <p className="text-sm text-gray-600 mt-1">
              {planName} Plan - {currency}{price}/{planPeriod}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Payment Gateway Options */}
        <div className="p-4 space-y-3">
          {paymentGateways.map((gateway) => (
            <div
              key={gateway.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedGateway === gateway.id
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedGateway(gateway.id)}
            >
              {/* Selection Indicator */}
              {selectedGateway === gateway.id && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}

              {/* Recommended Badge */}
              {gateway.recommended && (
                <div className="absolute top-8 right-3">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Gateway Icon */}
                <div className={`p-2 rounded-lg ${
                  selectedGateway === gateway.id ? "bg-cyan-100" : "bg-gray-100"
                }`}>
                  <div className={selectedGateway === gateway.id ? "text-cyan-600" : "text-gray-600"}>
                    {gateway.icon}
                  </div>
                </div>

                {/* Gateway Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-gray-900">{gateway.name}</h3>
                    {gateway.recommended && (
                      <span className="text-xs text-green-600 font-medium">★ Best</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{gateway.description}</p>
                  
                  {/* Features List */}
                  <div className="space-y-1">
                    {gateway.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-sm"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedGateway || isProcessing}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ${currency}${price}`
              )}
            </Button>
          </div>
          
          {/* Security Notice */}
          <div className="mt-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Bank-level encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentGatewayModal 