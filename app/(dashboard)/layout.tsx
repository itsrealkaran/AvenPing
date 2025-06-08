"use client";

import SidebarContainer from "@/components/layout/sidebar-container";
import { UserProvider } from "@/context/user-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCallback } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define navigation items with typed icon names
  const navigationItems = [
    {
      iconName: "LayoutDashboard" as const,
      label: "Dashboard",
      href: "/dashboard",
    },
    { iconName: "User" as const, label: "Profile", href: "/profile" },
    { iconName: "Contact" as const, label: "Contacts", href: "/contacts" },
    { iconName: "FileText" as const, label: "Templates", href: "/templates" },
    { iconName: "Send" as const, label: "Campaigns", href: "/campaigns" },
    {
      iconName: "MessageSquare" as const,
      label: "Messages",
      href: "/messages",
    },
    { iconName: "GitBranch" as const, label: "Flow", href: "/flows" },
    { iconName: "Bot" as const, label: "AI Bot", href: "/aibot" },
    { iconName: "BarChart" as const, label: "Analytics", href: "/analytics" },
    { iconName: "Settings" as const, label: "Settings", href: "/settings" },
  ];

  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden bg-[#fcfcfd]">
        <SidebarContainer
          brand={{
            name: "AvenPing",
            logo: "/logo-black.svg",
          }}
          navigationItems={navigationItems}
          accountInfo={{
            name: ["+91 9876543210", "+91 9876543217"],
          }}
          userProfile={{
            name: "Karan Singh",
            email: "karansingh@duck.com",
          }}
        />
        <main className="flex-1 overflow-auto bg-[#fcfcfd]">{children}</main>
      </div>
    </UserProvider>
  );
}
