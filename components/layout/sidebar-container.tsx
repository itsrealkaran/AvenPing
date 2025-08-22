"use client";

import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import { Brand, NavItem, UserProfile } from "./sidebar";

interface AccountInfoItem {
  name: string;
  number: string;
}

interface SidebarContainerProps {
  brand: Brand;
  navigationItems: NavItem[];
  userProfile: UserProfile;
}

export default function SidebarContainer({
  brand,
  navigationItems,
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
      className={`transition duration-300 ease-in-out flex-shrink-0 z-100 ${
        isSidebarCollapsed ? "w-[76px]" : "w-[260px]"
      }`}
    >
      <Sidebar
        brand={brand}
        navigationItems={navigationItems}
        userProfile={userProfile}
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
    </div>
  );
}
