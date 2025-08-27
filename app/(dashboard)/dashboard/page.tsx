"use client";

import { useEffect, useState, useRef } from "react";
import Body from "@/components/layout/body";
import { Card } from "@/components/ui/card";
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

  // Refs for auto-scrolling to priority cards
  const whatsappNumbersCardRef = useRef<HTMLDivElement>(null);
  const registerNumberCardRef = useRef<HTMLDivElement>(null);
  const businessVerificationCardRef = useRef<HTMLDivElement>(null);

  // Ref for the scrollable body container
  const bodyScrollRef = useRef<HTMLDivElement>(null);

  const { userInfo, hasWhatsAppAccount, refreshUser } = useUser();
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();

  useEffect(() => {
    if (
      userInfo?.whatsappAccount?.phoneNumbers &&
      userInfo?.whatsappAccount?.phoneNumbers?.length > 0
    ) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }

    if (
      userInfo?.whatsappAccount?.activePhoneNumber &&
      userInfo?.whatsappAccount?.activePhoneNumber?.isRegistered
    ) {
      setIsRegistered(true);
    } else {
      setIsRegistered(false);
    }

    if (
      userInfo?.whatsappAccount?.activePhoneNumber &&
      userInfo?.whatsappAccount?.activePhoneNumber?.codeVerificationStatus ===
        "VERIFIED"
    ) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  }, [userInfo]);

  // Refresh user data when WhatsApp connection status changes
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (hasWhatsAppAccount && !isConnected) {
        console.log(
          "Dashboard: Refreshing user data due to WhatsApp connection change"
        );
        await refreshUser();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(refreshInterval);
  }, [hasWhatsAppAccount, isConnected, refreshUser]);

  // Business Verification state
  const [isVerified, setIsVerified] = useState(true);

  // Helper function to get card z-index and styling
  const getCardZIndex = (
    cardType: "whatsapp-numbers" | "register-number" | "business-verification"
  ) => {
    if (!isConnected) {
      // If no WhatsApp account connected, WhatsApp Numbers card gets highest z-index
      return cardType === "whatsapp-numbers"
        ? "z-110 border-3 border-cyan-600"
        : "";
    } else if (isConnected && !isRegistered) {
      // If account connected but no phone numbers, Register Number card gets highest z-index
      return cardType === "register-number"
        ? "z-110 border-3 border-cyan-600"
        : "";
    } else if (isConnected && isRegistered && !isVerified) {
      // If business not verified, Business Verification card gets highest z-index
      return cardType === "business-verification"
        ? "z-110 border-3 border-cyan-600"
        : "";
    }
    // All conditions met, normal z-index
    return "z-10";
  };

  // Function to scroll to priority card within the body container
  const scrollToPriorityCard = () => {
    if (!bodyScrollRef.current) return;

    let targetCard: HTMLDivElement | null = null;

    if (!isConnected && whatsappNumbersCardRef.current) {
      targetCard = whatsappNumbersCardRef.current;
      console.log("Dashboard: Scrolling to WhatsApp Numbers card");
    } else if (isConnected && !isRegistered && registerNumberCardRef.current) {
      targetCard = registerNumberCardRef.current;
      console.log("Dashboard: Scrolling to Register Number card");
    } else if (
      isConnected &&
      isRegistered &&
      !isVerified &&
      businessVerificationCardRef.current
    ) {
      targetCard = businessVerificationCardRef.current;
      console.log("Dashboard: Scrolling to Business Verification card");
    }

    if (targetCard) {
      const bodyContainer = bodyScrollRef.current;
      const targetRect = targetCard.getBoundingClientRect();
      const bodyRect = bodyContainer.getBoundingClientRect();

      // Calculate the position to scroll to within the body container
      const scrollTop =
        bodyContainer.scrollTop +
        targetRect.top -
        bodyRect.top -
        bodyRect.height / 2 +
        targetRect.height / 2;

      bodyContainer.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll to priority card when status changes
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      scrollToPriorityCard();
    }, 100);

    return () => clearTimeout(timer);
  }, [isConnected, isRegistered, isVerified]);

  // Manual scroll function for testing
  const handleManualScroll = () => {
    scrollToPriorityCard();
  };

  const handleRegister = async (pin: string, phoneNumberId: string) => {
    try {
      const res = await axios.post("/api/whatsapp/phone-numbers/register", {
        pin,
        phoneNumberId,
      });

      if (res.data.success) {
        setIsRegistered(true);
        setShowRegisterModal(false);
        // Refresh user data to get updated registration status
        console.log("Dashboard: Phone number registered, refreshing user data");
        await refreshUser();
      } else {
        console.log(res.data.error);
      }
    } catch (error) {
      console.error("Error registering phone number:", error);
    }
  };

  const handleConnectAccount = async () => {
    //@ts-expect-error - Facebook SDK - Facebook SDK
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Logged in as:", response.authResponse, response);
          //@ts-expect-error - Facebook SDK - Facebook SDK
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
            .then(async (res) => {
              console.log(res.data);
              // Refresh user data to get updated WhatsApp account info
              if (res.data.success) {
                console.log(
                  "Dashboard: WhatsApp connected, refreshing user data"
                );
                await refreshUser();
              }
            })
            .catch((error) => {
              console.error("Error connecting WhatsApp:", error);
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

  // Dashboard content component to avoid repetition
  const DashboardContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Generator Card */}
        <Card
          title="QR Generator"
          className="md:col-span-1 md:row-span-2 !p-0"
          headerInfo="This is a QR code generator for WhatsApp. It allows you to generate a QR code that can be scanned by a WhatsApp user to start a conversation with your business."
          size="md"
        >
          <QrGeneratorCardContent />
        </Card>

        {/* WhatsApp Account Card */}
        <Card
          title="WhatsApp Account"
          headerInfo="Manage your connected WhatsApp numbers. Add new numbers or remove existing ones from your account."
          className={cn(
            "md:col-span-1 !p-0",
            getCardZIndex("whatsapp-numbers")
          )}
          size="md"
          ref={whatsappNumbersCardRef}
          hoverable={!isConnected}
          onClick={!isConnected ? () => scrollToPriorityCard() : undefined}
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
          size="md"
        >
          <WAButtonCardContent />
        </Card>

        {/* Register Number Card */}
        <Card
          title="Register Number"
          ref={registerNumberCardRef}
          headerInfo="This is a register number for WhatsApp. It allows you to register a number that can be used to send and receive messages from WhatsApp."
          className={cn("md:col-span-1 !p-0", getCardZIndex("register-number"))}
          hoverable={isConnected && !isRegistered}
          onClick={
            isConnected && !isRegistered
              ? () => scrollToPriorityCard()
              : undefined
          }
          size="md"
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
          className={cn(
            "md:col-span-2 !p-0",
            getCardZIndex("business-verification")
          )}
          ref={businessVerificationCardRef}
          hoverable={isConnected && isRegistered && !isVerified}
          onClick={
            isConnected && isRegistered && !isVerified
              ? () => scrollToPriorityCard()
              : undefined
          }
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
    </>
  );

  // Loading skeleton component
  const MetricCards = () => (
    <>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
        {analyticsData?.metrics?.map((metric, index) => (
          <MetricCard key={index} {...metric} isLoading={!analyticsLoading} />
        )) ||
          // Fallback to sample metrics if no analytics data
          [
            {
              title: "Sent Messages",
              value: "0",
              change: 0,
            },
            {
              title: "Delivery Rate",
              value: "0%",
              change: 0,
            },
            {
              title: "Active Contacts",
              value: "0",
              change: 0,
            },
            {
              title: "Response Rate",
              value: "0%",
              change: 0,
            },
          ].map((metric, index) => (
            <MetricCard key={index} {...metric} isLoading={analyticsLoading} />
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
    </>
  );

  return (
    <Body
      title="Dashboard"
      className={cn(
        hasWhatsAppAccount && isConnected && isRegistered
          ? "relative overflow-hidden"
          : ""
      )}
      ref={bodyScrollRef}
    >
      {/* WhatsApp Connection Overlay - Only covers dashboard body */}
      {(!hasWhatsAppAccount || !isConnected || !isRegistered) && (
        <div className="absolute inset-0 backdrop-blur-xs z-10 pointer-events-none" />
      )}

      <MetricCards />
      <DashboardContent />
    </Body>
  );
}
