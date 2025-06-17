"use client";

import Body from "@/components/layout/body";
import { MessageSquare } from "lucide-react";
import MessagesInterface from "@/components/messages/messages-interface";

export default function MessagesPage() {
  return (
    <Body title="Messages">
      <MessagesInterface />
    </Body>
  );
}
