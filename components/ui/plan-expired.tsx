import { useUser } from "@/context/user-context";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Settings, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

export function WhatsAppAccountRequired() {
  const { hasWhatsAppAccount, userInfo, isLoading } = useUser();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (hasWhatsAppAccount) {
      setIsConnected(true);
    }
  }, [hasWhatsAppAccount]);

  // Show loading state while user data is being fetched
  if (isLoading || userInfo === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Loading...</h2>
            <p className="text-gray-600">Loading your account information...</p>
          </div>
        </Card>
      </div>
    );
  }

  // If user has WhatsApp account, don't show anything
  if (hasWhatsAppAccount) {
    return null;
  }

  const handleConnectAccount = async () => {
    //@ts-ignore
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Logged in as:", response.authResponse);
          //@ts-ignore
          FB.api("/me", { fields: "name, email" }, (userInfo) => {
            console.log(
              "Logged in as:",
              userInfo.name,
              "Email:",
              userInfo.email
            );
            setIsConnected(true);
          });

          axios
            .post("/api/whatsapp", {
              code: response.authResponse.code,
            })
            .then((res) => {
              console.log(res.data);
            });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management,whatsapp_business_messaging,business_management",
      }
    );
  };

  // Show WhatsApp account required message
  return (
    <>
      <div className=" absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              WhatsApp Account Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to set up your WhatsApp Business account to access this
              feature.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                To get started, you'll need to:
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Register your phone number
                </li>
                <li className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Complete business verification
                </li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => handleConnectAccount()}>
              Connect WhatsApp Account
            </Button>
          </div>
        </Card>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
    </>
  );
}
