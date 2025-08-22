"use client";

import {
  ChevronDown,
  FolderClosed,
  LayoutDashboard,
  MoreVertical,
  Package,
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
  SidebarClose,
  SidebarOpen,
  Bell,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn, formatPhoneNumber } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";

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
  | "User"
  | "Bell";

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
  Bell,
};

// Types for navigation items
export interface NavItem {
  iconName: IconName;
  label: string;
  href: string;
  hasSubmenu?: boolean;
}

// Types for account information
export interface AccountInfoItem {
  name: string;
  number: string;
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
  accountInfo?: AccountInfoItem[]; // Optional for backward compatibility
  userProfile?: UserProfile;
  brand?: Brand;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  brand,
  navigationItems = [],
  userProfile = { name: "apectory", email: "apectory@duck.com" },
  isCollapsed = false,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userInfo, setActivePhoneNumber, refreshUser } = useUser();

  // Get account info directly from user context for real-time updates
  const currentAccountInfo =
    userInfo?.whatsappAccount?.phoneNumbers?.map((phone: any) => ({
      name: phone.name,
      number: phone.phoneNumber,
    })) || [];

  // Get current user profile from context
  const currentUserProfile = {
    name: userInfo?.whatsappAccount?.name || userProfile.name,
    email: userInfo?.whatsappAccount?.email || userProfile.email,
    avatar: userProfile.avatar,
  };

  // Debug logging for account info updates
  useEffect(() => {
    console.log("Sidebar: Account info updated:", currentAccountInfo);
  }, [currentAccountInfo]);

  // Debug logging for dropdown state
  useEffect(() => {
    console.log("Sidebar: Dropdown state changed:", accountDropdownOpen);
  }, [accountDropdownOpen]);

  const handleLogout = async () => {
    const response = await axios.post("/api/auth/signout");
    if (response.status === 200) {
      router.push("/login");
    }
  };

  const handleChangeAccount = (phoneNumber: string) => {
    setActivePhoneNumber(phoneNumber);
  };

  const items = navigationItems.length > 0 ? navigationItems : [];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside user menu dropdown
      if (
        userMenuOpen &&
        userMenuRef.current &&
        !userMenuRef.current.contains(target)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [userMenuOpen]);

  // Simple click outside handler - only close when clicking outside the entire sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector(
        ".flex.flex-col.h-screen.w-full.sticky.top-0"
      );
      if (
        accountDropdownOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };

    if (accountDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountDropdownOpen]);

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen w-full sticky top-0 overflow-y-auto transition-all duration-300">
        {/* Header */}
        <div
          className={cn(
            "flex flex-col items-center px-6 pt-4 pb-2",
            isCollapsed
              ? "p-0 pt-4 pb-2 border-b border-gray-200"
              : "justify-between"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              !isCollapsed && "justify-between w-full"
            )}
          >
            {!isCollapsed && (
              <Link href="" className="flex items-center font-bold text-xl">
                <img src={brand?.logo} alt={brand?.name} className="w-7 h-7" />
                <span className="tracking-tight text-cyan-600">
                  {brand?.name}
                </span>
              </Link>
            )}
            {isCollapsed && (
              <Tooltip>
                <TooltipTrigger>
                  <img
                    src={brand?.logo}
                    alt={brand?.name}
                    className="w-8 h-8"
                  />
                </TooltipTrigger>
                <TooltipContent side="right">{brand?.name}</TooltipContent>
              </Tooltip>
            )}
            {!isCollapsed && (
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => onCollapsedChange?.(!isCollapsed)}
              >
                <SidebarClose size={20} className="text-gray-400" />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button
              className="mt-2 p-1 rounded-full hover:bg-gray-100"
              onClick={() => onCollapsedChange?.(!isCollapsed)}
            >
              <SidebarOpen size={20} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Account */}
        {!isCollapsed && currentAccountInfo.length > 0 && (
          <div className="px-4 pt-2 pb-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative">
              {/* Header */}
              <div className="flex items-center justify-between p-2 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-600">
                  Phone Numbers
                </span>
                <button
                  onClick={() => refreshUser()}
                  className="text-xs text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                  Refresh
                </button>
              </div>

              {/* Current Selection */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {userInfo?.whatsappAccount?.activePhoneNumber?.name ||
                        "Select Number"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatPhoneNumber(
                        userInfo?.whatsappAccount?.activePhoneNumber
                          ?.phoneNumber || ""
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      console.log(
                        "Toggle dropdown clicked, current state:",
                        accountDropdownOpen
                      );
                      setAccountDropdownOpen((prev) => !prev);
                    }}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform duration-200 ${
                        accountDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 right-0 top-full bg-white border-t border-gray-100 rounded-b-xl shadow-lg z-50 transition-all duration-200 ${
                  accountDropdownOpen
                    ? "opacity-100 visible"
                    : "opacity-0 invisible"
                }`}
              >
                <div className="py-1">
                  {currentAccountInfo.map((acc, index) => {
                    const isActive =
                      acc.number ===
                      userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumber;
                    return (
                      <button
                        key={index}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          isActive
                            ? "bg-cyan-50 text-cyan-700"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          handleChangeAccount(acc.number);
                          setAccountDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">
                              {acc.name}
                            </div>
                            <div
                              className={`text-xs ${
                                isActive ? "text-cyan-600" : "text-gray-500"
                              }`}
                            >
                              {formatPhoneNumber(acc.number)}
                            </div>
                          </div>
                          {isActive && (
                            <div className="text-cyan-600">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto flex flex-col">
          <ul
            className={cn(
              "space-y-1 px-6 pt-2 flex-1",
              isCollapsed ? "px-4" : "px-6"
            )}
          >
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
                          "flex items-center py-1.5 text-[14px] rounded-md font-normal transition-all",
                          isCollapsed ? "justify-center px-2" : "gap-2 px-2",
                          isActive
                            ? "bg-[#FDFDFD] shadow-sm border border-[#DBDBDB]"
                            : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                        )}
                      >
                        <Icon size={18} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Card at Bottom */}
        {isCollapsed ? (
          <div className="mt-auto flex flex-col items-center pb-6">
            {/* Logout button */}
            <div className="flex flex-col items-center p-2 pt-4 gap-3 justify-center bg-white rounded-xl shadow-lg border-2 border-gray-100 group">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="flex items-center justify-center transition-all"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    <LogOut
                      size={16}
                      className="text-red-500 group-hover:text-red-600"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="h-10 w-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200">
                    {currentUserProfile.avatar ? (
                      <img
                        src={currentUserProfile.avatar}
                        alt={currentUserProfile.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-800">
                      {currentUserProfile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUserProfile.email}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex flex-col items-center pb-6">
            {userMenuOpen && (
              <div
                ref={userMenuRef}
                className="w-[90%] mb-1 bg-white border-2 border-gray-200 rounded-md shadow-xl z-10 relative"
              >
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-red-500 flex items-center gap-2"
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </li>
                </ul>
                {/* Arrow in bottom right */}
                <div className="absolute -bottom-0.5 right-4 w-2 h-2 bg-white border-r-2 border-b-2 border-gray-200 transform rotate-45"></div>
              </div>
            )}
            <div className="w-[90%] bg-white rounded-xl border-2 border-[#E0E0E0] shadow-lg flex items-center gap-2 px-4 py-3">
              {currentUserProfile.avatar ? (
                <img
                  src={currentUserProfile.avatar}
                  alt={currentUserProfile.name}
                  className="h-8 w-8 flex-1 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                  <User size={16} className="text-gray-500" />
                </div>
              )}
              <div className="flex flex-col w-[67%]">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {currentUserProfile.name}
                </p>
                <p className="text-xs text-gray-500 leading-tight truncate">
                  {currentUserProfile.email}
                </p>
              </div>
              <button
                aria-label="More options"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="ml-auto p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
