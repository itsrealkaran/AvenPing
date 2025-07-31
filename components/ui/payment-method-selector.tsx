"use client"

import { Select } from "./select"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentMethodSelectorProps {
  onPaymentMethodChange: (method: string) => void
  selectedMethod: string
  className?: string
}

export function PaymentMethodSelector({
  onPaymentMethodChange,
  selectedMethod,
  className = "",
}: PaymentMethodSelectorProps) {
  const paymentMethods = [
    {
      value: "razorpay",
      label: "Razorpay",
      description: "Pay with UPI, Cards, Net Banking",
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      value: "stripe",
      label: "Stripe",
      description: "Pay with International Cards",
      icon: <CreditCard className="h-4 w-4" />,
    },
  ]

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        Payment Method
      </label>
      <Select 
        value={selectedMethod} 
        onChange={(e) => onPaymentMethodChange(e.target.value)}
        options={paymentMethods.map(method => ({
          value: method.value,
          label: `${method.label} - ${method.description}`
        }))}
      />
    </div>
  )
}

interface PaymentMethodInfoProps {
  method: string
}

export function PaymentMethodInfo({ method }: PaymentMethodInfoProps) {
  const getMethodInfo = (method: string) => {
    switch (method) {
      case "razorpay":
        return {
          title: "Razorpay",
          description: "Secure payments with UPI, Cards, Net Banking",
          features: [
            "UPI payments",
            "Credit/Debit cards",
            "Net banking",
            "Wallets",
            "Instant settlements",
          ],
          icon: <Wallet className="h-5 w-5 text-blue-600" />,
        }
      case "stripe":
        return {
          title: "Stripe",
          description: "International payment processing",
          features: [
            "International cards",
            "Multiple currencies",
            "Advanced fraud protection",
            "Global reach",
            "Developer-friendly",
          ],
          icon: <CreditCard className="h-5 w-5 text-purple-600" />,
        }
      default:
        return {
          title: "Select Payment Method",
          description: "Choose your preferred payment method",
          features: [],
          icon: null,
        }
    }
  }

  const info = getMethodInfo(method)

  if (!info.icon) {
    return null
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        {info.icon}
        <div>
          <h4 className="font-medium text-gray-900">{info.title}</h4>
          <p className="text-sm text-gray-600">{info.description}</p>
        </div>
      </div>
      <ul className="space-y-1">
        {info.features.map((feature, index) => (
          <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
} 