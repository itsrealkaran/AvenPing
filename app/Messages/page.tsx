"use client";

import Body from "@/components/ui/body";
import { MessageSquare } from "lucide-react";
import MessagesInterface from "@/components/messages/messages-interface";

export default function MessagesPage() {
  return (
    <Body icon={MessageSquare} title="Messages">
      <MessagesInterface />
    </Body>
  );
}
