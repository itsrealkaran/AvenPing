"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { Brand, NavItem, AccountInfo, UserProfile } from "./sidebar";

interface SidebarContainerProps {
  brand: Brand;
  navigationItems: NavItem[];
  accountInfo: AccountInfo;
  userProfile: UserProfile;
}

export default function SidebarContainer({
  brand,
  navigationItems,
  accountInfo,
  userProfile,
}: SidebarContainerProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsSidebarCollapsed(window.innerWidth < 1024);
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarCollapsed ? "w-[70px]" : "w-[250px]"
      }`}
    >
      <Sidebar
        brand={brand}
        navigationItems={navigationItems}
        accountInfo={accountInfo}
        userProfile={userProfile}
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
    </div>
  );
}
