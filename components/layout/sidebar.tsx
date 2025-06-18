"use client";

import {
  ChevronDown,
  ChevronRight,
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
  ChevronLeft,
  SidebarClose,
  SidebarOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  accountInfo?: AccountInfoItem[];
  userProfile?: UserProfile;
  brand?: Brand;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({
  brand,
  navigationItems = [],
  accountInfo = [],
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
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl"
              >
                <img src={brand?.logo} alt={brand?.name} className="w-7 h-7" />
                <span className="tracking-tight text-gray-800">
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
        {!isCollapsed && accountInfo.length > 0 && (
          <div className="px-4 pt-2 pb-2">
            <div className="bg-white rounded-xl shadow flex flex-col items-start px-4 py-3 mb-2 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Choose Number</p>
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 rounded-md p-1">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {accountInfo[0].name}
                    </span>
                    <p className="text-xs text-gray-400">
                      {accountInfo[0].number}
                    </p>
                  </div>
                </div>
                <button
                  className="ml-2 p-1 rounded hover:bg-gray-50"
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                >
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      accountDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              {accountDropdownOpen && (
                <div className="absolute left-8 right-8 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {accountInfo.length > 0 ? (
                      accountInfo.map((acc, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => {
                            handleChangeAccount();
                            setAccountDropdownOpen(false);
                          }}
                        >
                          <div className="font-medium">{acc.name}</div>
                          <div className="text-xs text-gray-400">
                            {acc.number}
                          </div>
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
                    {userProfile.avatar ? (
                      <img
                        src={userProfile.avatar}
                        alt={userProfile.name}
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
                    <p className="font-medium text-gray-200">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-gray-400">{userProfile.email}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="mt-auto flex flex-col items-center pb-6">
            <div className="w-[90%] bg-white rounded-xl shadow-lg flex items-center gap-2 px-4 py-3 border border-gray-100">
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
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {userProfile.email}
                </p>
              </div>
              <button
                aria-label="More options"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="ml-auto p-1 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={20} className="text-gray-400" />
              </button>
              {userMenuOpen && (
                <div className="absolute bottom-14 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
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
        )}
      </div>
    </TooltipProvider>
  );
}
