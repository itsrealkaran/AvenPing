"use client";

import SidebarContainer from "@/components/layout/sidebar-container";
import { UserProvider, useUser } from "@/context/user-context";
import Header from "@/components/layout/header";

// Loading Screen Component
function LoadingScreen() {
  return (<></>
    // <div className="fixed inset-0 z-150 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    //   <div className="flex flex-col items-center space-y-4">
    //     <div className="animate-pulse">
    //       <img
    //         src="/AvenPing-Logo.svg"
    //         alt="AvenPing Logo"
    //         className="w-24 h-24"
    //       />
    //     </div>
    //     {/* <div className="text-gray-600 text-sm font-medium">Loading...</div> */}
    //   </div>
    // </div>
  );
}

// Separate component that uses the user context
function DashboardContent({ children }: { children: React.ReactNode }) {
  const { userInfo, setActivePhoneNumber, isLoading } = useUser();

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
    <>
      {isLoading && <LoadingScreen />}
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
            logo: "/AvenPing-Logo.svg",
          }}
          navigationItems={navigationItems}
          userProfile={{
            name: userInfo?.name || "User",
            email: userInfo?.email || "user@example.com",
          }}
        />
        <div className="flex flex-col flex-1 relative overflow-hidden bg-white rounded-xl mr-2 border-[#E0DADA] border-5">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </>
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
