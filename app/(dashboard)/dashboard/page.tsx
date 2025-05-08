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
import axios from "axios";
import { toast } from "sonner";

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

useEffect(() => {
  if (whatsAppCode) {
    setConnecting(true);
    axios.post('/api/whatsapp', { code: whatsAppCode }).then((res) => {
      toast.success('WhatsApp connected successfully');
    }).catch((err) => {
      toast.error('Failed to connect WhatsApp');
    });
  }
}, [whatsAppCode]);

  return (
    <Body icon={LayoutDashboard} title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="QR Generator" className="md:col-span-1">
          <div className="space-y-4 p-4">
            <div>
              <label
                htmlFor="qrText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter Text
              </label>
              <textarea
                id="qrText"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="Enter text for QR code"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              disabled={!qrText.trim()}
            >
              Generate QR Code
            </button>
          </div>
        </Card>

        {/* Register Number Card */}
        <Card title="Register Number" className="md:col-span-1">
          <div className="flex flex-col items-center justify-center h-full py-4 p-4">
            {isRegistered ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">Account Registered</p>
                <p className="text-sm text-gray-500">
                  Your number is registered and ready to use
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mb-2" />
                <p className="text-lg font-medium mb-4">Not Registered</p>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* WAButton Card */}
        <Card title="WAButton" className="md:col-span-1">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="buttonColor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <input
                  type="color"
                  id="buttonColor"
                  value={buttonColor}
                  onChange={(e) => setButtonColor(e.target.value)}
                  className="w-full p-1 border rounded-md h-10"
                />
              </div>

              <div>
                <label
                  htmlFor="buttonRoundness"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Roundness
                </label>
                <input
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

            <div>
              <label
                htmlFor="buttonText"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Text
              </label>
              <input
                type="text"
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="border rounded-md p-4 flex justify-center">
              <div
                style={{
                  backgroundColor: buttonColor,
                  borderRadius: `${buttonRoundness}px`,
                  padding: "10px 20px",
                  color: "white",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                {buttonText || "Chat with us"}
              </div>
            </div>

            <button
              onClick={() => setShowWAButtonModal(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              Get Code
            </button>
          </div>
        </Card>

        {/* WhatsApp Account Card */}
        <Card title="WhatsApp Account" className="md:col-span-1">
          <div className="space-y-4 p-4">
            {connectedAccounts.length > 0 ? (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Connected Accounts
                </h3>
                <ul className="space-y-2">
                  {connectedAccounts.map((account, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <MessageSquare size={16} />
                      </div>
                      <span>{account}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-4">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No accounts connected</p>
              </div>
            )}

            <button
              onClick={handleConnectAccount}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
            >
              {connecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Phone size={16} />
              )}
              Connect WhatsApp Account
            </button>
          </div>
        </Card>

        {/* Business Verification Card */}
        <Card
          title="Business Verification"
          variant="darkHeader"
          className="md:col-span-2"
        >
          <div className="flex items-center justify-between p-4">
            <div>
              {isVerified ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Your business is verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <span>
                    Your business is not verified. Verify now to unlock all
                    features.
                  </span>
                </div>
              )}
            </div>

            {!isVerified && (
              <a
                href="https://business.example.com/verify"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Verify Now
              </a>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <QRCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        text={qrText}
        phoneNumber={phoneNumber}
      />

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
