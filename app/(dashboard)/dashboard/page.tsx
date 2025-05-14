"use client";

import {
  LayoutDashboard,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import Body from "@/components/ui/body";
import Card from "@/components/ui/card";
import QRCodeModal from "@/components/dashboard/qr-code-modal";
import RegisterNumberModal from "@/components/dashboard/register-number-modal";
import WAButtonModal from "@/components/dashboard/wa-button-modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // QR Generator state
  const [qrText, setQrText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91 9876543210");
  const [showQrModal, setShowQrModal] = useState(false);

  // Register Number state
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // WAButton state
  const [buttonColor, setButtonColor] = useState("#25D366");
  const [buttonRoundness, setButtonRoundness] = useState("8");
  const [buttonText, setButtonText] = useState("Chat with us on WhatsApp");
  const [showWAButtonModal, setShowWAButtonModal] = useState(false);
  const [whatsAppCode, setWhatsAppCode] = useState("");
  const [connecting, setConnecting] = useState(false);

  // WhatsApp Account state
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);

  // Business Verification state
  const [isVerified, setIsVerified] = useState(false);
  const handleRegister = (pin: string) => {
    console.log("Registered with PIN:", pin);
    setIsRegistered(true);
  };

  const handleConnectAccount = () => {
    //@ts-ignore
  FB.login(
    (response: any) => {
      if (response.authResponse) {
        console.log('Logged in as:', response.authResponse);
        //@ts-ignore
        FB.api('/me', { fields: 'name, email' }, (userInfo) => {
          console.log('Logged in as:', userInfo.name, 'Email:', userInfo.email);
          setWhatsAppCode(response.authResponse.code);
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    },
    {
      config_id: '1931062140756222',
      response_type: 'code',
      override_default_response_type: true,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
    }
  );
};

  return (
    <Body icon={LayoutDashboard} title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Generator Card */}
        <Card title="QR Generator" className="md:col-span-1 md:row-span-2 !p-0">
          <div className="flex flex-col gap-4 p-5">
            <label
              htmlFor="qrText"
              className="text-xs font-medium text-gray-600"
            >
              Message
            </label>
            <Textarea
              id="qrText"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="w-full"
              rows={3}
              placeholder="Enter text for QR code"
            />
            <label
              htmlFor="phoneNumber"
              className="text-xs font-medium text-gray-600"
            >
              Phone Number
            </label>
            <Input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={() => setShowQrModal(true)}
              className="w-full text-sm py-2 rounded-md transition disabled:opacity-50"
              disabled={!qrText.trim()}
            >
              Generate QR Code
            </Button>
          </div>
        </Card>

        {/* Register Number Card */}
        <Card title="Register Number" className="md:col-span-1">
          <div className="flex flex-col items-center justify-center w-full p-5 gap-2">
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
        </Card>

        {/* WAButton Card */}
        <Card title="WAButton" className="md:col-span-1 md:row-span-2 !p-0">
          <div className="flex flex-col gap-4 p-5">
            <div className="border border-gray-200 rounded-md p-3 flex justify-center bg-gray-50">
              <div
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: `${buttonRoundness}px`,
                  padding: "8px 16px",
                  color: "white",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  display: "inline-block",
                }}
              >
                {buttonText || "Chat with us"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="buttonColor"
                  className="text-xs font-medium text-gray-600"
                >
                  Color
                </label>
                <Input
                  type="color"
                  id="buttonColor"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="w-full h-8 border border-gray-200 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="buttonRoundness"
                  className="text-xs font-medium text-gray-600"
                >
                  Roundness
                </label>
                <Input
                  type="range"
                  id="buttonRoundness"
                  min="0"
                  max="20"
                  value={buttonRoundness}
                  onChange={(e) => setButtonRoundness(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            <label
              htmlFor="buttonText"
              className="text-xs font-medium text-gray-600"
            >
              Text
            </label>
            <Input
              type="text"
              id="buttonText"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full"
            />
            <Button
              onClick={() => setShowWAButtonModal(true)}
              className="w-full text-sm py-2 rounded-md transition"
            >
              Get Code
            </Button>
          </div>
        </Card>

        {/* WhatsApp Account Card */}
        <Card title="WhatsApp Account" className="md:col-span-1 !p-0">
          <div className="p-5">
            {connectedAccounts.length > 0 ? (
              <>
                <div className="text-xs font-medium text-gray-600 mb-2">
                  Connected Accounts
                </div>
                <ul className="space-y-2">
                  {connectedAccounts.map((account, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-sm"
                    >
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <MessageSquare size={14} />
                      </div>
                      <span>{account}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-center py-4 text-xs text-gray-400">
                <MessageSquare className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                No accounts connected
              </div>
            )}
            <Button
              onClick={handleConnectAccount}
              className="w-full mt-4 bg-green-500 text-sm py-2 rounded-md hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <Phone size={14} /> Connect WhatsApp Account
            </Button>
          </div>
        </Card>

        {/* Business Verification Card */}
        <Card
          title="Business Verification"
          variant="darkHeader"
          className="md:col-span-2 !p-0"
        >
          <div className="flex items-center justify-between p-5">
            <div>
              {isVerified ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Your business is verified
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Your business is not verified. Verify now to unlock all
                  features.
                </div>
              )}
            </div>
            {!isVerified && (
              <Button
                onClick={() => {
                  window.open("https://business.example.com/verify", "_blank");
                }}
                className="px-4 py-2 text-sm rounded-md transition"
              >
                Verify Now
              </Button>
            )}
          </div>
        </Card>
      </div>
      {/* Modals */}
      {showQrModal && (
        <QRCodeModal
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          text={qrText}
          phoneNumber={phoneNumber}
        />
      )}
      <RegisterNumberModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
      <WAButtonModal
        isOpen={showWAButtonModal}
        onClose={() => setShowWAButtonModal(false)}
        color={buttonColor}
        roundness={buttonRoundness}
        text={buttonText}
      />
    </Body>
  );
}
