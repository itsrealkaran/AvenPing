import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AvenPing",
  description: "AvenPing",
};

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
    { iconName: "Users" as const, label: "Contacts", href: "/contacts" },
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen overflow-hidden">
          <div className="w-64 flex-shrink-0">
            <Sidebar
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
                // avatar: "/images/avatar.jpg" // Uncomment if you have an avatar image
              }}
            />
          </div>
          <div className="flex-1 overflow-auto bg-[#fcfcfd]">{children}</div>
        </div>
      </body>
    </html>
  );
}
