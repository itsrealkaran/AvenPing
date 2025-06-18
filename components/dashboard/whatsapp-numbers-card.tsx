import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";
import React from "react";

type Props = {
  connectedAccounts: string[];
  handleConnectAccount: () => void;
};

export default function WhatsAppNumbersCardContent({
  connectedAccounts,
  handleConnectAccount,
}: Props) {
  return <div></div>;
}
