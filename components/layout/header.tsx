"use client";

import { Search, Bell, BookMarked } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [shortcut, setShortcut] = useState<{ mod: string; key: string }>({
    mod: "⌘",
    key: "F",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = window.navigator.platform.toLowerCase();
      if (platform.includes("mac")) {
        setShortcut({ mod: "⌘", key: "F" });
      } else {
        setShortcut({ mod: "Ctrl", key: "F" });
      }
    }
  }, []);

  return (
    <TooltipProvider>
      <header className="w-full flex items-center px-6 py-2 bg-white shadow-xs border-b border-gray-200 rounded-t-xl">
        {/* Search Bar */}
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white min-w-[260px] max-w-xs">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center ml-2 space-x-1 bg-gray-100 rounded px-1.5 py-0.5 text-xs text-gray-400 font-medium">
            <span className="font-mono">{shortcut.mod}</span>
            <span className="font-mono">{shortcut.key}</span>
          </div>
        </div>
        {/* Spacer */}
        <div className="flex-1" />
        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 transition" onClick={() => router.push("/notifications")}>
                <Bell size={20} className="text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100 transition">
                <BookMarked size={20} className="text-gray-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Docs</TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
