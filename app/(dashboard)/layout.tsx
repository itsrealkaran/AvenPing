"use client";

import SidebarContainer from "@/components/layout/sidebar-container";
import { UserProvider, useUser } from "@/context/user-context";
import Header from "@/components/layout/header";

// Separate component that uses the user context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { userInfo, setActivePhoneNumber } = useUser();

  console.log(userInfo, 'userInfo');

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
    <div className="flex h-screen overflow-hidden relative py-2">
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
        accountInfo={userInfo && userInfo.whatsappAccount && userInfo.whatsappAccount.phoneNumbers.length > 0 ? userInfo.whatsappAccount.phoneNumbers.map((phone: any) => {
          return {
            name: phone.name,
            number: phone.phoneNumber,
          }
        }) : []}
        userProfile={{
          name: userInfo && userInfo.whatsappAccount && userInfo.whatsappAccount.name || '',
          email: userInfo && userInfo.whatsappAccount && userInfo.whatsappAccount.email || '',
        }}
      />
      <div className="flex flex-col flex-1 relative overflow-hidden bg-white rounded-xl mr-2 border-[#E0DADA] border-5">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <DashboardContent>{children}</DashboardContent>
    </UserProvider>
  );
}
