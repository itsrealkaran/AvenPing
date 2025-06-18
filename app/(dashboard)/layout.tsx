"use client";

import SidebarContainer from "@/components/layout/sidebar-container";
import { UserProvider } from "@/context/user-context";
import Header from "@/components/layout/header";

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
      <div className="flex h-screen overflow-hidden relative py-2">
        <div className="absolute inset-0 bg-[#EDEDED]bg-gradient.svg backdrop-blur-sm" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg-gradient.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/bg-bottom.svg')",
            backgroundSize: "contain",
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
          }}
        />
        <SidebarContainer
          brand={{
            name: "AvenPing",
            logo: "/logo-black.svg",
          }}
          navigationItems={navigationItems}
          accountInfo={[
            { name: "Karan Singh", number: "+91 9876543210" },
            { name: "Rahul Kumar", number: "+91 9876543217" },
          ]}
          userProfile={{
            name: "Karan Singh",
            email: "karansingh@duck.com",
          }}
        />
        <div className="flex flex-col relative flex-1 bg-white rounded-xl mr-2 border-[#E0DADA] border-5">
          <Header />
          <main className="overflow-auto relative flex-1">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
