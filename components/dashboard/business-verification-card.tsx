import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import React from "react";

type Props = {
  isVerified: boolean;
  onVerify: () => void;
};

export default function BusinessVerificationCardContent({
  isVerified,
  onVerify,
}: Props) {
  return <div className="flex items-center justify-between"></div>;
}
