import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AlertCircle,
  Info,
  MessageSquare,
  PlusCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

type Props = {
  isConnected: boolean;
  handleConnectAccount: () => void;
};

export default function WhatsAppNumbersCardContent({
  isConnected,
  handleConnectAccount,
}: Props) {
  return (
    <div className="flex flex-col w-full gap-3">
      {isConnected ? (
        <>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-base font-semibold text-gray-800">
                WhatsApp Connected
              </div>
              <div className="text-sm text-gray-500">
                Your WhatsApp Business account is connected and ready to use
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mt-1">
              <WifiOff className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-800 mb-2">
                WhatsApp Not Connected
              </div>
              <div className="text-sm text-gray-500 mb-4 leading-relaxed">
                You need to connect your WhatsApp Business account to access all
                features. Without this connection, you won't be able to send
                messages, manage campaigns, or use the messaging interface.
              </div>
              <Button
                onClick={handleConnectAccount}
                className="px-6 py-2 text-sm rounded-lg transition-colors bg-primary hover:bg-primary/90 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Connect WhatsApp
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
