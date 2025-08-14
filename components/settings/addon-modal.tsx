"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PaymentGatewayModal from "./payment-gateway-modal"

interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

interface Addon {
  id: string
  name: string
  monthlyPriceJson: PriceJson
  yearlyPriceJson: PriceJson
  features: string[]
  isAddOn: boolean
  isActivated?: boolean
  isActive?: boolean
}

interface AddonModalProps {
  isOpen: boolean
  onClose: () => void
  addon: Addon
  months: number
  onMonthsChange: (months: number) => void
  region: "US" | "IND" | "ASIA"
  quantity?: number
  onQuantityChange?: (quantity: number) => void
}

const AddonModal: React.FC<AddonModalProps> = ({
  isOpen,
  onClose,
  addon,
  months,
  onMonthsChange,
  region,
  quantity = 1,
  onQuantityChange
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [localQuantity, setLocalQuantity] = useState(() => {
    // MOBILEAPP addon can only have quantity of 1
    if (addon.name === "MOBLIEAPP") {
      return 1
    }
    return quantity
  })

  // Ensure MOBILEAPP quantity is always 1
  useEffect(() => {
    if (addon.name === "MOBLIEAPP" && localQuantity !== 1) {
      setLocalQuantity(1)
      onQuantityChange?.(1)
    }
  }, [addon.name, localQuantity, onQuantityChange])
  
  if (!isOpen) return null

  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    switch (region) {
      case "US": return "$"
      case "IND": return "₹"
      case "ASIA": return "$"
      default: return "$"
    }
  }

  const getMonthlyPrice = () => {
    const priceJson = addon.monthlyPriceJson
    return priceJson[region]
  }

  const getTotalPrice = () => {
    return getMonthlyPrice() * months * localQuantity
  }

  const currencySymbol = getCurrencySymbol(region)
  const monthlyPrice = getMonthlyPrice()
  const totalPrice = getTotalPrice()

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-100">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Get {addon.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Addon Info */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h4>
            <p className="text-gray-600 text-sm">{addon.features.join(', ')}</p>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {currencySymbol}{monthlyPrice}
            </span>
            <span className="text-gray-600">/month</span>
          </div>
        </div>

        {/* Month Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Total Months</label>
            <span className="text-sm font-semibold text-gray-900">{months} month{months > 1 ? 's' : ''}</span>
          </div>
          
          <input
            type="range"
            min="1"
            max="12"
            value={months}
            onChange={(e) => onMonthsChange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            {(() => {
              const currentDate = new Date()
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              const currentMonth = currentDate.getMonth()
              
              // Create array starting from current month
              const monthsFromCurrent = []
              for (let i = 0; i < 12; i++) {
                const monthIndex = (currentMonth + i) % 12
                monthsFromCurrent.push(monthNames[monthIndex])
              }
              
              return monthsFromCurrent.map((month, index) => (
                <span key={index} className="text-center">
                  {month}
                </span>
              ))
            })()}
          </div>
        </div>

        {/* Quantity Field */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Quantity</label>
            <span className="text-sm font-semibold text-gray-900">{localQuantity}</span>
          </div>
          
          {/* Show quantity restriction message for MOBILEAPP */}
          {addon.name === "MOBLIEAPP" && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 text-center">
                ⓘ MOBILEAPP addon can only have quantity of 1
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (localQuantity > 1) {
                  const newQuantity = localQuantity - 1
                  setLocalQuantity(newQuantity)
                  onQuantityChange?.(newQuantity)
                }
              }}
              disabled={localQuantity <= 1 || addon.name === "MOBLIEAPP"}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <input
              type="number"
              min="1"
              max={addon.name === "MOBLIEAPP" ? 1 : 100}
              value={localQuantity}
              onChange={(e) => {
                let newQuantity = Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                // Restrict MOBILEAPP to max quantity of 1
                if (addon.name === "MOBLIEAPP") {
                  newQuantity = Math.min(newQuantity, 1)
                }
                setLocalQuantity(newQuantity)
                onQuantityChange?.(newQuantity)
              }}
              className={`w-16 text-center border rounded-md px-2 py-1 text-sm ${
                addon.name === "MOBLIEAPP" 
                  ? "border-blue-300 bg-blue-50 text-blue-700 cursor-not-allowed" 
                  : "border-gray-300"
              }`}
              disabled={addon.name === "MOBLIEAPP"}
            />
            
            <button
              onClick={() => {
                const newQuantity = localQuantity + 1
                // Don't allow increasing quantity for MOBILEAPP
                if (addon.name !== "MOBLIEAPP") {
                  setLocalQuantity(newQuantity)
                  onQuantityChange?.(newQuantity)
                }
              }}
              disabled={addon.name === "MOBLIEAPP"}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Total Price:</span>
            <span className="text-xl font-bold text-gray-900">
              {currencySymbol}{totalPrice}
            </span>
          </div>
          <div className="text-sm text-gray-500 text-center mt-1">
            {localQuantity} × {months} month{months > 1 ? 's' : ''} × {currencySymbol}{monthlyPrice}/month
            {addon.name === "MOBLIEAPP" && (
              <div className="text-xs text-blue-600 mt-1">
                (Quantity fixed at 1 for MOBILEAPP)
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowPaymentModal(true)
            }}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Get Addon
          </Button>
        </div>
      </div>
      
      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planName={addon.name}
        planPeriod="month"
        region={region}
        price={totalPrice}
        currency={currencySymbol}
        isAddon={true}
        months={months}
        quantity={localQuantity}
      />
    </div>
  )
}

export default AddonModal
