
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface Step2Props {
  onNext: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

const Step2WhatsAppConnect: React.FC<Step2Props> = ({
  onNext,
  onSkip,
  isLoading,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      // Automatically proceed to the next step after a successful connection
      setTimeout(() => {
        onNext();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Connect WhatsApp</h3>
        <p className="text-muted-foreground">
          Connect your WhatsApp account to start marketing
        </p>
      </div>

      <Card className="border-2 border-dashed border-gray-200 hover:border-whatsapp transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {connected ? (
            <div className="flex flex-col items-center space-y-2 py-6">
              <div className="h-12 w-12 rounded-full bg-whatsapp/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-whatsapp" />
              </div>
              <p className="font-medium">WhatsApp Connected Successfully!</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to next step...
              </p>
            </div>
          ) : (
            <>
              <div className="h-16 w-16 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="#25D366"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                  <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                  <path d="M9 15h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Connect WhatsApp</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Connect your WhatsApp Business account to start sending messages
                to your customers
              </p>
              <Button
                onClick={handleConnect}
                className="bg-whatsapp hover:bg-whatsapp-dark"
                disabled={connecting}
              >
                {connecting ? "Connecting..." : "Connect WhatsApp"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6">
        <Button
          variant="outline"
          onClick={onSkip}
          disabled={isLoading || connecting}
          className="text-muted-foreground"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default Step2WhatsAppConnect;
