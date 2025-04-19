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
} from "lucide-react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    url: "#",
    icon: LayoutTemplate,
  },
  {
    title: "Campaigns",
    url: "#",
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
    <Sidebar variant="sidebar" className="bg-white">
      <SidebarHeader className="flex items-center gap-2 p-5">
        <div className="flex items-center gap-2">
          <Image src="/logo-main.svg" alt="AvenPing" width={28} height={28} />
          <h1 className="text-xl font-bold text-brand-color">AvenPing</h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span className="text-md font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <SidebarMenuButton>
          <ChartArea />
          Analytics
        </SidebarMenuButton>
        <SidebarMenuButton>
          <Settings />
          Settings
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
