"use client";

import type React from "react";

import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegisterNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (pin: string, phoneNumberId: string) => void;
}

// Helper to normalize phone numbers: remove +, -, spaces, etc.
function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

// Helper to format PIN: add a dash after every digit typed (except after the last digit)
function formatPin(pin: string) {
  // Only keep digits, then add a dash after each digit except the last
  const digits = pin.replace(/[^\d]/g, "").slice(0, 6);
  return digits
    .split("")
    .map((digit, idx, arr) => (idx < arr.length - 1 ? digit + "-" : digit))
    .join("");
}

// Helper to unformat PIN: remove all dashes
function unformatPin(formatted: string) {
  return formatted.replace(/-/g, "");
}

export default function RegisterNumberModal({
  isOpen,
  onClose,
  onRegister,
}: RegisterNumberModalProps) {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(""); // store only digits, not formatted
  const [error, setError] = useState("");
  const { userInfo } = useUser();

  if (!userInfo) return null;

  if (!isOpen) return null;

  // When user types, always show the normalized version in the input
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const normalized = normalizePhoneNumber(rawValue);
    setPhoneNumber(normalized);
    setError("");
  };

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    // Normalize both entered and active phone numbers for comparison
    const enteredNumber = normalizePhoneNumber(phoneNumber.trim());
    const activePhoneNumber =
      userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumber;
    const normalizedActive = normalizePhoneNumber(activePhoneNumber || "");
    if (enteredNumber !== normalizedActive) {
      setError("Phone number does not match your registered number");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("PIN is required");
      return;
    }
    if (pin.length !== 6) {
      setError("PIN must be exactly 6 digits");
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      setError("PIN must contain only numbers");
      return;
    }
    onRegister(
      pin,
      userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId!
    );
    onClose();
  };

  const handleClose = () => {
    setStep(1);
    setPhoneNumber("");
    setPin("");
    setError("");
    onClose();
  };

  // Add a dash after every digit typed in the PIN input
  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters, limit to 6 digits
    const digits = unformatPin(e.target.value);
    setPin(digits);
    setError("");
  };

  const activePhoneNumber =
    userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumber;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-100" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 z-120">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {step === 1 ? "Register Your Number" : "Create PIN"}
                </h2>
                <p className="text-sm text-gray-600">
                  {step === 1
                    ? `Secure your WhatsApp number ${activePhoneNumber}`
                    : "Create a secure 6-digit PIN"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Confirm Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please confirm your phone number to proceed
                    </p>
                  </div>

                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <Button
                    onClick={handleSubmitPhone}
                    className="w-full"
                    disabled={!phoneNumber.trim()}
                  >
                    Continue to PIN Setup
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleSubmitPin} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="pin"
                      className="text-sm font-medium text-gray-700"
                    >
                      PIN
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        type="text"
                        id="pin"
                        value={formatPin(pin)}
                        onChange={handlePinChange}
                        placeholder="Enter 6-digit PIN"
                        maxLength={11} // 6 digits + 5 dashes
                        className="text-center text-lg tracking-widest font-mono"
                        inputMode="numeric"
                        autoComplete="off"
                      />
                      {pin.length === 6 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        PIN must be exactly 6 digits
                      </p>
                      <div className="flex gap-1">
                        {[...Array(6)].map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index < pin.length
                                ? "bg-[#30CFED]"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={pin.length !== 6}
                    >
                      Register Number
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
