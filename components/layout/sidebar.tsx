"use client";

import {
  Bell,
  Book,
  ChevronDown,
  ChevronRight,
  FolderClosed,
  LayoutDashboard,
  MoreVertical,
  Package,
  Search,
  Settings,
  Contact2 as Contact,
  TrendingUp,
  User,
  Users,
  CreditCard,
  HelpCircle,
  LucideIcon,
  FileText,
  Send,
  MessageSquare,
  GitBranch,
  Bot,
  BarChart,
  ChevronLeft,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

// Types for icon identifiers
export type IconName =
  | "LayoutDashboard"
  | "FolderClosed"
  | "Package"
  | "TrendingUp"
  | "Settings"
  | "Users"
  | "CreditCard"
  | "HelpCircle"
  | "FileText"
  | "Send"
  | "MessageSquare"
  | "GitBranch"
  | "Bot"
  | "Contact"
  | "BarChart"
  | "User";

// Map of icon names to components
const iconMap: Record<IconName, LucideIcon> = {
  LayoutDashboard,
  FolderClosed,
  Package,
  TrendingUp,
  Settings,
  Users,
  CreditCard,
  Contact,
  HelpCircle,
  FileText,
  Send,
  MessageSquare,
  GitBranch,
  Bot,
  BarChart,
  User,
};

// Types for navigation items
export interface NavItem {
  iconName: IconName;
  label: string;
  href: string;
  hasSubmenu?: boolean;
}

// Types for account information
export interface AccountInfo {
  name: string[];
}

// Types for user profile
export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export interface Brand {
  name: string;
  logo: string;
}

// Main sidebar props interface
interface SidebarProps {
  navigationItems?: NavItem[];
  accountInfo?: AccountInfo;
  userProfile?: UserProfile;
  brand?: Brand;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  brand,
  navigationItems = [],
  accountInfo = {
    name: [],
  },
  userProfile = { name: "apectory", email: "apectory@duck.com" },
  isCollapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleChangeAccount = () => {
    console.log("Change Account");
  };

  const items = navigationItems.length > 0 ? navigationItems : [];

  return (
    <TooltipProvider>
      <div className="flex">
        <div
          className={cn(
            "flex flex-1 flex-col h-screen bg-white border-r border-gray-200 sticky top-0 overflow-y-auto transition-all duration-300"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center p-4 pb-2 ${is}",
              isCollapsed
                ? "justify-center pb-2 border-b border-gray-200"
                : "justify-between"
            )}
          >
            {!isCollapsed && (
              <Link
                href="/"
                className="flex items-center gap-1 font-bold text-xl"
              >
                <img
                  src={brand?.logo}
                  alt={brand?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span>{brand?.name}</span>
              </Link>
            )}
            {isCollapsed && (
              <Tooltip>
                <TooltipTrigger>
                  <img
                    src={brand?.logo}
                    alt={brand?.name}
                    className="w-6 h-6 rounded-full"
                  />
                </TooltipTrigger>
                <TooltipContent side="right">{brand?.name}</TooltipContent>
              </Tooltip>
            )}
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Documentation"
                      className="hover:bg-gray-100 rounded-md"
                    >
                      <Book size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Documentation</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      aria-label="Notifications"
                      className="hover:bg-gray-100 rounded-md"
                    >
                      <Bell size={20} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </div>
            )}
          </div>

          {isCollapsed && (
            <ul className="space-y-1 p-2">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/documentations"
                      className="flex items-center px-2 py-2 text-sm rounded-md justify-center text-gray-700 hover:bg-gray-100"
                    >
                      <Book size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Documentations</TooltipContent>
                </Tooltip>
              </li>

              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/notifications"
                      className="flex items-center px-2 py-2 text-sm rounded-md justify-center text-gray-700 hover:bg-gray-100"
                    >
                      <Bell size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Notifications</TooltipContent>
                </Tooltip>
              </li>
            </ul>
          )}

          {/* Account */}
          {!isCollapsed && (
            <>
              {" "}
              <div className="px-4 py-2">
                <p className="text-sm text-gray-500">Phone Number</p>
              </div>
              <div className="mx-4 mb-2 relative">
                <button
                  className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-md hover:bg-gray-50"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {accountInfo.name[0]?.split(",")[0] || "Account"}
                    </span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      accountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <ul className="py-1">
                      {accountInfo.name.length > 0 ? (
                        accountInfo.name.map((name, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => {
                              handleChangeAccount();
                              setAccountDropdownOpen(false);
                            }}
                          >
                            {name}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-sm text-gray-500">
                          No accounts available
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto border-t border-gray-200">
            <ul className="space-y-1 p-2">
              {items.map((item, index) => {
                const Icon = iconMap[item.iconName];
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center py-2 text-md rounded-md",
                            isCollapsed ? "justify-center px-2" : "gap-3 px-3",
                            isActive
                              ? "bg-sky-100 text-sky-400"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          <Icon size={20} />
                          {!isCollapsed && <span>{item.label}</span>}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="mt-auto border-t border-gray-200 p-4 relative">
            <div
              className={cn(
                "flex items-center",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-3">
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-500" />
                      </div>
                    )}
                    {!isCollapsed && (
                      <div>
                        <p className="text-sm font-medium text-left">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-gray-500 text-left">
                          {userProfile.email}
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <div>
                      <p className="font-medium">{userProfile.name}</p>
                      <p className="text-xs opacity-80">{userProfile.email}</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
              {!isCollapsed && (
                <button
                  aria-label="More options"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </button>
              )}
            </div>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-16 right-4 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-red-500 flex items-center gap-2"
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <span>Sign Out</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col justify-center items-center border-t border-gray-200">
          <button
            onClick={() => onCollapsedChange?.(!isCollapsed)}
            className="hover:bg-gray-100 rounded-r-md py-4 border border-gray-200 border-l-0"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}
