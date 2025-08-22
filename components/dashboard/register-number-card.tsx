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
    <div className="flex flex-col w-full gap-3">
      {isRegistered ? (
        <>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-base font-semibold text-gray-800">
                Registered
              </div>
              <div className="text-sm text-gray-500">
                Your number is registered and ready to use
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mt-1">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-800 mb-2">
                Not Registered
              </div>
              <div className="text-sm text-gray-500 mb-4 leading-relaxed">
                Your phone number needs to be registered with WhatsApp Business
                API to send and receive messages. If already registered, please
                enter the PIN or update the PIN in Whatsapp Business Dashboard.
              </div>
              <Button onClick={() => setShowRegisterModal(true)} size="sm">
                Register Now
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
