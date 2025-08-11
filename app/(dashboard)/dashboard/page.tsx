"use client";

import { useEffect, useState } from "react";
import Body from "@/components/layout/body";
import Card from "@/components/ui/card";
import RegisterNumberModal from "@/components/dashboard/register-number-modal";
import QrGeneratorCardContent from "@/components/dashboard/qr-generator-card";
import RegisterNumberCardContent from "@/components/dashboard/register-number-card";
import WAButtonCardContent from "@/components/dashboard/wa-button-card";
import WhatsAppNumbersCardContent from "@/components/dashboard/whatsapp-numbers-card";
import BusinessVerificationCardContent from "@/components/dashboard/business-verification-card";
import MetricCard from "@/components/analytics/metric-card";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-analytics";

export default function DashboardPage() {
  // Register Number state
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const { userInfo, hasWhatsAppAccount } = useUser();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();

  useEffect(() => {
    if (userInfo?.whatsappAccount?.phoneNumbers && userInfo?.whatsappAccount?.phoneNumbers?.length > 0) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

    if (userInfo?.whatsappAccount?.activePhoneNumber && userInfo?.whatsappAccount?.activePhoneNumber?.isRegistered) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }

    if (userInfo?.whatsappAccount?.activePhoneNumber && userInfo?.whatsappAccount?.activePhoneNumber?.codeVerificationStatus === 'VERIFIED') {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [userInfo]);

  // Business Verification state
  const [isVerified, setIsVerified] = useState(true);

  const handleRegister = (pin: string, phoneNumberId: string) => {
    axios
      .post("/api/whatsapp/phone-numbers/register", {
        pin,
        phoneNumberId,
      })
      .then((res) => {
        if (res.data.success) {
          setIsRegistered(true);
          setShowRegisterModal(false);
        } else {
          console.log(res.data.error);
        }
      });
  };

  const handleConnectAccount = async () => {
    //@ts-ignore
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Logged in as:", response.authResponse, response);
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

  // Loading state for metrics
  if (analyticsLoading) {
    return (
      <Body title="Dashboard" className={cn(hasWhatsAppAccount ? 'relative overflow-hidden' : '')}>
        {/* Metrics Grid with Loading State */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="border-3 border-[#E0E0E0] rounded-2xl bg-white p-4 flex flex-col animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="flex justify-between gap-4">
                <div className="flex flex-col">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-28 h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-6 mx-2 px-1 flex justify-end border-b-3 border-gray-200 pb-1">
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
              onRegister={() => setShowRegisterModal(true)}
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

  return (
    <Body title="Dashboard" className={cn(hasWhatsAppAccount ? 'relative overflow-hidden' : '')}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        {analyticsData?.metrics?.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        )) || (
          // Fallback to sample metrics if no analytics data
          [
            {
              title: "Sent Messages",
              value: "0",
              change: 0
            },
            {
              title: "Delivery Rate",
              value: "0%",
              change: 0
            },
            {
              title: "Active Contacts",
              value: "0",
              change: 0
            },
            {
              title: "Response Rate",
              value: "0%",
              change: 0
            }
          ].map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))
        )}
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
            onRegister={() => setShowRegisterModal(true)}
            setShowRegisterModal={setShowRegisterModal}
          />
        </Card>

        {/* Business Verification Card */}
        <Card
          title="Business Verification"
          headerInfo="Verify your business with WhatsApp to avoid account bans and unlock all features. Without verification, your WhatsApp Business account may be restricted or banned."
          className="md:col-span-2 !p-0"
        >
          <BusinessVerificationCardContent isVerified={isVerified} />
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
