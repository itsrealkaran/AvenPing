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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Type for icon identifiers
type IconName = 
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
interface NavItem {
  iconName: IconName;
  label: string;
  href: string;
  hasSubmenu?: boolean;
}

// Types for account information
interface AccountInfo {
  name: string[];
}

// Types for user profile
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface Brand {
  name: string;
  logo: string;
}

// Main sidebar props interface
interface SidebarProps {
  navigationItems?: NavItem[];
  accountInfo?: AccountInfo;
  userProfile?: UserProfile;
  brand?: Brand;
}

export default function Sidebar({
  brand,
  navigationItems = [],
  accountInfo = {
    name: [],
  },
  userProfile = { name: "apectory", email: "apectory@duck.com" },
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
    <div className="flex flex-col h-screen border-r border-gray-200 sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-1 font-bold text-xl">
          <img src={brand?.logo} alt={brand?.name} className="w-6 h-6 rounded-full" />
          <span>{brand?.name}</span>
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Documentation">
            <Book size={20} />
          </button>
          <button aria-label="Notifications">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      {/* <div className="px-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Account */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-500">Phone Number</p>
      </div>
      {/* Account Selector */}
      <div className="mx-4 mb-2 relative">
        <button 
          className="w-full flex items-center justify-between p-2 border border-gray-200 rounded-md hover:bg-gray-50"
          onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
        >
          <div className="flex items-center gap-2">
            <span>{accountInfo.name[0]?.split(",")[0] || "Account"}</span>
          </div>
          <ChevronDown size={20} className={`text-gray-400 transition-transform ${accountDropdownOpen ? 'rotate-180' : ''}`} />
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
                <li className="px-4 py-2 text-sm text-gray-500">No accounts available</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto border-t border-gray-200">
        <ul className="space-y-1 p-2">
          {items.map((item, index) => {
            const Icon = iconMap[item.iconName];
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    item.hasSubmenu ? "justify-between" : "gap-3"
                  } px-2 py-2 text-sm rounded-md ${
                    isActive
                      ? "bg-sky-100 text-sky-400"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-gray-200 p-4 relative">
        <div className="flex items-center justify-between">
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
            <div>
              <p className="text-sm font-medium">{userProfile.name}</p>
              <p className="text-xs text-gray-500">{userProfile.email}</p>
            </div>
          </div>
          <button 
            aria-label="More options" 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>
        
        {userMenuOpen && (
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
  );
}
