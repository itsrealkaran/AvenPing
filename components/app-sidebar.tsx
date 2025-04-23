"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  BotMessageSquare,
  Calendar,
  Caravan,
  ChartArea,
  Contact,
  Home,
  LayoutTemplate,
  MessageCircle,
  Search,
  Settings,
  Workflow,
  BookOpen,
  Bell,
  ChevronDownIcon,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Contact,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: LayoutTemplate,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Caravan,
  },
  {
    title: "Messages",
    url: "#",
    icon: MessageCircle,
  },
  {
    title: "Flow",
    url: "#",
    icon: Workflow,
  },
  {
    title: "AIBot",
    url: "#",
    icon: BotMessageSquare,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartArea,
  },
];

export function AppSidebar() {
  const [currentPath, setCurrentPath] = useState("");

  return (
    <Sidebar variant="floating" className="bg-white">
      <SidebarHeader className="!flex-row items-center justify-between !p-5">
        <div className="flex items-center gap-2">
          <Image src="/logo-main.svg" alt="AvenPing" width={28} height={28} />
          <h1 className="text-xl font-bold text-brand-color">AvenPing</h1>
        </div>
        <div className="flex items-center gap-4">
          <BookOpen className="w-5 h-5 text-gray-600" />
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <div className="p-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/logo-main.svg"
                    alt="User Name"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <span className="text-sm font-medium">gitcuber369-rn</span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border border-gray-300 rounded-md shadow-lg w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
              <DropdownMenuItem>Switch to Profile 1</DropdownMenuItem>
              <DropdownMenuItem>Switch to Profile 2</DropdownMenuItem>
              <DropdownMenuItem>Switch to Profile 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="mr-2" />
                      <span className="text-md font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-5">
        <Separator />
        <div className="flex items-center gap-2 mt-4">
          <Image
            src="/logo-main.svg"
            alt="User Name"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">User Name</span>
            <span className="text-xs text-gray-500">user@example.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
