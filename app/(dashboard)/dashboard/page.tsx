"use client";

import { useState } from "react";
import Body from "@/components/layout/body";
import Card from "@/components/ui/card";
import QRCodeModal from "@/components/dashboard/qr-code-modal";
import RegisterNumberModal from "@/components/dashboard/register-number-modal";
import WAButtonModal from "@/components/dashboard/wa-button-modal";
import QrGeneratorCardContent from "@/components/dashboard/qr-generator-card";
import RegisterNumberCardContent from "@/components/dashboard/register-number-card";
import WAButtonCardContent from "@/components/dashboard/wa-button-card";
import WhatsAppNumbersCardContent from "@/components/dashboard/whatsapp-numbers-card";
import BusinessVerificationCardContent from "@/components/dashboard/business-verification-card";

export default function DashboardPage() {
  // QR Generator state
  const [qrText, setQrText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91 9876543210");
  const [showQrModal, setShowQrModal] = useState(false);

  // Register Number state
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // WAButton state
  const [showWAButtonModal, setShowWAButtonModal] = useState(false);

  // WhatsApp Account state
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);

  // Business Verification state
  const [isVerified, setIsVerified] = useState(false);

  const handleRegister = (pin?: string) => {
    setIsRegistered(true);
  };

  const handleConnectAccount = () => {
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
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        config_id: "1931062140756222",
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management,whatsapp_business_messaging,business_management",
      }
    );
  };

  return (
    <Body title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Generator Card */}
        <Card
          title="QR Generator"
          className="md:col-span-1 md:row-span-2 !p-0"
          headerInfo="This is a QR code generator for WhatsApp. It allows you to generate a QR code that can be scanned by a WhatsApp user to start a conversation with your business."
        >
          <QrGeneratorCardContent
            qrText={qrText}
            setQrText={setQrText}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onGenerate={() => setShowQrModal(true)}
          />
        </Card>

        {/* Register Number Card */}
        <Card
          title="Register Number"
          headerInfo="This is a register number for WhatsApp. It allows you to register a number that can be used to send and receive messages from WhatsApp."
          className="md:col-span-1"
        >
          <RegisterNumberCardContent
            isRegistered={isRegistered}
            onRegister={handleRegister}
            setShowRegisterModal={setShowRegisterModal}
          />
        </Card>

        {/* WAButton Card */}
        <Card
          title="WAButton"
          headerInfo="This is a WAButton for WhatsApp. It allows you to generate a WAButton that can be used as contact button on your website."
          className="md:col-span-1 md:row-span-2 !p-0"
        >
          <WAButtonCardContent />
        </Card>

        {/* WhatsApp Account Card */}
        <Card
          title="WhatsApp Numbers"
          headerInfo="Manage your connected WhatsApp numbers. Add new numbers or remove existing ones from your account."
          className="md:col-span-1 !p-0"
        >
          <WhatsAppNumbersCardContent
            connectedAccounts={connectedAccounts}
            handleConnectAccount={handleConnectAccount}
          />
        </Card>

        {/* Business Verification Card */}
        <Card
          title="Business Verification"
          headerInfo="Verify your business with WhatsApp to avoid account bans and unlock all features. Without verification, your WhatsApp Business account may be restricted or banned."
          className="md:col-span-2 !p-0"
        >
          <BusinessVerificationCardContent
            isVerified={isVerified}
            onVerify={() => {
              window.open("https://business.example.com/verify", "_blank");
            }}
          />
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
      {/* <WAButtonModal
        isOpen={showWAButtonModal}
        onClose={() => setShowWAButtonModal(false)}
        color={buttonColor}
        roundness={buttonRoundness}
        text={buttonText}
      /> */}
    </Body>
  );
}
