import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  connectedNumbers: {
    name: string;
    avatar: string;
    number: string;
  }[];
  handleConnectAccount: () => void;
};

export default function WhatsAppNumbersCardContent({
  connectedNumbers,
  handleConnectAccount,
}: Props) {
  return <div></div>;
}
