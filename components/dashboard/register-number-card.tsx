import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  isRegistered: boolean;
  onRegister: (pin?: string) => void;
  setShowRegisterModal: (v: boolean) => void;
};

export default function RegisterNumberCardContent({
  isRegistered,
  onRegister,
  setShowRegisterModal,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-2">
      {isRegistered ? (
        <>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-base font-semibold text-gray-800">
            Registered
          </div>
          <div className="text-xs text-gray-500 text-center">
            Your number is registered and ready to use
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-base font-semibold text-gray-800 mb-1">
            Not Registered
          </div>
          <Button
            onClick={() => setShowRegisterModal(true)}
            className="px-4 py-2 text-sm rounded-md transition"
          >
            Register Now
          </Button>
        </>
      )}
    </div>
  );
}
