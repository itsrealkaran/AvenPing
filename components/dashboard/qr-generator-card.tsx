import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  qrText: string;
  setQrText: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  onGenerate: () => void;
};

export default function QrGeneratorCardContent({
  qrText,
  setQrText,
  phoneNumber,
  setPhoneNumber,
  onGenerate,
}: Props) {
  return <div className="flex flex-col gap-4"></div>;
}
