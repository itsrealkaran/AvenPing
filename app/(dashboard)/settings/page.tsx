"use client";

import * as React from "react";
import {
  User,
  Bell,
  Tag,
  ShoppingCart,
  CreditCard,
  FileText,
  CheckCircle,
  Home,
} from "lucide-react";
import Body from "@/components/layout/body";
import axios from "axios";
import { initiateRazorpayPayment } from "@/lib/razorpay-utils";
import { toast } from "sonner";
import { useUser } from "@/context/user-context";
import GeneralSettings from "@/components/settings/general-settings";
import ContactSettings from "@/components/settings/contact-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import LabelSettings from "@/components/settings/label-settings";
import CatalogSettings from "@/components/settings/catalog-settings";
import SubscriptionSettings from "@/components/settings/subscription-settings";
import PaymentHistorySettings from "@/components/settings/payment-history-settings";
import BlueTickSettings from "@/components/settings/blue-tick-settings";

const settingsNavigation = [
  {
    category: "PERSONAL",
    items: [
      { id: "general", title: "General", icon: Home },
      { id: "contacts", title: "Contacts", icon: User },
      { id: "notifications", title: "Notifications", icon: Bell },
      { id: "labels", title: "Labels", icon: Tag },
    ],
  },
  {
    category: "BUSINESS",
    items: [
      // { id: "catalogs", title: "Catalogs", icon: ShoppingCart },
      { id: "subscription", title: "Subscription", icon: CreditCard },
      { id: "paymentHistory", title: "Payment History", icon: FileText },
      { id: "blueTick", title: "Blue Tick Request", icon: CheckCircle },
    ],
  },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("general");
  const [optInStatus, setOptInStatus] = React.useState(true);
  const [notifications, setNotifications] = React.useState({
    chats: true,
    campaigns: true,
    planExpiry: true,
    systemUpdates: false,
  });
  const [labels, setLabels] = React.useState([
    { id: 1, name: "Important", color: "#ef4444" },
    { id: 2, name: "Follow Up", color: "#f59e0b" },
    { id: 3, name: "Completed", color: "#10b981" },
  ]);
  const [newLabelName, setNewLabelName] = React.useState("");
  const [newLabelColor, setNewLabelColor] = React.useState("#3b82f6");
  const [optOutStatus, setOptOutStatus] = React.useState(false);
  const [optOutKeywords, setOptOutKeywords] = React.useState(
    "STOP, UNSUBSCRIBE, CANCEL"
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState("stripe");

  const { userInfo } = useUser();

  const addLabel = () => {
    if (newLabelName.trim()) {
      setLabels([
        ...labels,
        {
          id: Date.now(),
          name: newLabelName,
          color: newLabelColor,
        },
      ]);
      setNewLabelName("");
      setNewLabelColor("#3b82f6");
    }
  };

  const removeLabel = (id: number) => {
    setLabels(labels.filter((label) => label.id !== id));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            optOutStatus={optOutStatus}
            setOptOutStatus={setOptOutStatus}
          />
        );
      case "contacts":
        return <ContactSettings />;
      case "notifications":
        return (
          <NotificationSettings
            notifications={notifications}
            setNotifications={setNotifications}
          />
        );
      case "labels":
        return <LabelSettings />;
      case "catalogs":
        return <CatalogSettings />;
      case "subscription":
        return <SubscriptionSettings />;
      case "paymentHistory":
        return <PaymentHistorySettings />;
      case "blueTick":
        return <BlueTickSettings />;
      default:
        return (
          <GeneralSettings
            optOutStatus={optOutStatus}
            setOptOutStatus={setOptOutStatus}
          />
        );
    }
  };

  // Get current section title for breadcrumb
  const getCurrentSectionTitle = () => {
    const allItems = settingsNavigation.flatMap((category) => category.items);
    const currentItem = allItems.find((item) => item.id === activeSection);
    return currentItem?.title || "General";
  };

  // Get page sections for "On this page" navigation
  const getPageSections = () => {
    switch (activeSection) {
      case "general":
        return ["Opt-out Status", "WhatsApp Connection", "Danger Zone"];
      case "contacts":
        return ["Contact Management"];
      case "notifications":
        return ["Notification Preferences"];
      case "labels":
        return ["Manage Labels"];
      default:
        return [];
    }
  };

  // Check if current section is a business setting
  const isBusinessSection = () => {
    const businessSections = [
      "catalogs",
      "subscription",
      "paymentHistory",
      "blueTick",
    ];
    return businessSections.includes(activeSection);
  };

  return (
    <Body title="Settings">
      <div
        className={`flex gap-8 w-full mx-auto ${
          isBusinessSection() ? "justify-start" : ""
        }`}
      >
        {/* Left Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="sticky top-16">
            <nav className="space-y-6">
              {settingsNavigation.map((category) => (
                <div key={category.category}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {category.category}
                  </h3>
                  <div className="space-y-1">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md font-medium transition-all ${
                          activeSection === item.id
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`${isBusinessSection() ? "flex-1 max-w-none" : "flex-1"}`}
        >
          <div className="bg-gray-50 h-[calc(100vh-180px)] overflow-y-auto p-8">
            {renderContent()}
          </div>
        </div>

        {/* Right "On this page" Summary - Only for Personal Settings */}
        {!isBusinessSection() && (
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-16">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  On this page
                </h3>
                <nav className="space-y-1">
                  {getPageSections().map((section, index) => (
                    <a
                      key={section}
                      href={`#${section.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block text-sm text-gray-600 hover:text-gray-900 py-1 transition-colors"
                    >
                      {section}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </Body>
  );
}
