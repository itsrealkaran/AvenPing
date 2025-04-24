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
} from "lucide-react";
import Link from "next/link";

export default function ExpoSidebar() {
  return (
    <div className="flex flex-col h-screen border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-1 font-bold text-xl">
          <span className="text-black">^</span>
          <span>Expo</span>
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
      <div className="px-4">
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
      </div>

      {/* Account */}
      <div className="px-4 py-2">
        <p className="text-sm text-gray-500">Account</p>
      </div>

      {/* Account Selector */}
      <div className="mx-4 mb-2 p-2 border border-gray-200 rounded-md">
        <button className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              A
            </div>
            <span>apectory</span>
          </div>
          <ChevronDown size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto border-t border-gray-200">
        <ul className="space-y-1 p-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-2 py-2 text-sm rounded-md bg-blue-100 text-blue-600"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="flex items-center gap-3 px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FolderClosed size={20} />
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link
              href="/snacks"
              className="flex items-center gap-3 px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              <Package size={20} />
              <span>Snacks</span>
            </Link>
          </li>
          <li>
            <Link
              href="/usage"
              className="flex items-center gap-3 px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              <TrendingUp size={20} />
              <span>Usage</span>
            </Link>
          </li>
          <li>
            <Link
              href="/account-settings"
              className="flex items-center justify-between px-2 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} />
                <span>Account settings</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={16} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium">apectory</p>
              <p className="text-xs text-gray-500">apectory@duck.com</p>
            </div>
          </div>
          <button aria-label="More options">
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
