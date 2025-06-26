"use client"

import type React from "react"

import { X } from "lucide-react"
import { useState } from "react"
import { useUser } from "@/context/user-context"

interface RegisterNumberModalProps {
  isOpen: boolean
  onClose: () => void
  onRegister: (pin: string, phoneNumberId: string) => void
}

export default function RegisterNumberModal({ isOpen, onClose, onRegister }: RegisterNumberModalProps) {
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const { userInfo } = useUser()

  if (!userInfo) return null

  if (!isOpen) return null

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      setError("Phone number is required")
      return
    }
    setError("")
    setStep(2)
  }

  const handleSubmitPin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin.trim()) {
      setError("PIN is required")
      return
    }
    if (pin.length < 4) {
      setError("PIN must be at least 4 digits")
      return
    }
    onRegister(pin, userInfo.whatsappAccount.activePhoneNumber?.phoneNumberId!)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{step === 1 ? "Register Your Number " + userInfo.whatsappAccount.activePhoneNumber?.phoneNumber : "Create PIN"}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
          <form onSubmit={handleSubmitPin}>
            <div className="mb-4">
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-1">
                Create PIN
              </label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter a 4-digit PIN"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Your PIN will be used to secure your account</p>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Register
            </button>
          </form>
      </div>
    </div>
  )
}
