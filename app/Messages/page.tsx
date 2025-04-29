"use client";

import Body from "@/components/ui/body";
import { MessageSquare } from "lucide-react";
import MessagesInterface from "@/components/messages/messages-interface";
import { useState } from "react";

export default function MessagesPage() {
  return (
    <Body icon={MessageSquare} title="Messages">
      <MessagesInterface />
    </Body>
  );
} 