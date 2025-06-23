"use client";

import { useState } from "react";
import Body from "@/components/layout/body";
import Card from "@/components/ui/card";
import RegisterNumberModal from "@/components/dashboard/register-number-modal";
import QrGeneratorCardContent from "@/components/dashboard/qr-generator-card";
import RegisterNumberCardContent from "@/components/dashboard/register-number-card";
import WAButtonCardContent from "@/components/dashboard/wa-button-card";
import WhatsAppNumbersCardContent from "@/components/dashboard/whatsapp-numbers-card";
import BusinessVerificationCardContent from "@/components/dashboard/business-verification-card";
import MetricCard from "@/components/analytics/metric-card";
import { sampleMetrics } from "@/components/analytics/data";
import Link from "next/link";

export default function DashboardPage() {
  // Register Number state
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Business Verification state
  const [isVerified, setIsVerified] = useState(true);

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
            setIsConnected(true);
          });
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management,whatsapp_business_messaging,business_management",
      }
    );
  };

  return (
    <Body title="Dashboard">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        {sampleMetrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      <div className="mb-6 mx-2 px-1 flex justify-end border-b-3 border-gray-200 pb-1">
        {/* view all analytics */}
        <Link
          href="/analytics"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {`View All Analytics >>`}
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Generator Card */}
        <Card
          title="QR Generator"
          className="md:col-span-1 md:row-span-2 !p-0"
          headerInfo="This is a QR code generator for WhatsApp. It allows you to generate a QR code that can be scanned by a WhatsApp user to start a conversation with your business."
        >
          <QrGeneratorCardContent />
        </Card>

        {/* Register Number Card */}
        <Card
          title="Register Number"
          headerInfo="This is a register number for WhatsApp. It allows you to register a number that can be used to send and receive messages from WhatsApp."
          className="md:col-span-1"
        >
          <WhatsAppNumbersCardContent
            isConnected={isConnected}
            handleConnectAccount={handleConnectAccount}
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
          <RegisterNumberCardContent
            isRegistered={isRegistered}
            onRegister={handleRegister}
            setShowRegisterModal={setShowRegisterModal}
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
              window.open(
                "https://business.facebook.com/settings/info",
                "_blank"
              );
            }}
          />
        </Card>
      </div>
      {/* Modals */}
      <RegisterNumberModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
    </Body>
  );
}
