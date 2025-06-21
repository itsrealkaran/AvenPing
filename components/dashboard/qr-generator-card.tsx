import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CloudUpload, Copy, Share2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const contacts = [
  {
    name: "Karan Singh",
    number: "+91 9876543210",
  },
  {
    name: "Satyam Singh",
    number: "+91 9876543211",
  },
  {
    name: "Shantanu Singh",
    number: "+91 9876543212",
  },
  {
    name: "Vijay Singh",
    number: "+91 9876543213",
  },
];

export default function QrGeneratorCardContent() {
  const [qrText, setQrText] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(contacts[0].number);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleContactSelect = (number: string) => {
    setPhoneNumber(number);
    setIsGenerated(false);
  };

  const qrValue = `https://wa.me/${phoneNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(qrText)}`;

  const handleGenerate = () => {
    if (!qrText.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    setIsGenerated(true);
    toast.success("QR Code generated successfully!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrValue);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "WhatsApp QR Code",
        text: "Scan this QR code to start a chat.",
        url: qrValue,
      });
    } else {
      toast.error("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phone Number Section */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Phone Number
          </label>
          <div className="grid grid-cols-2 gap-2">
            {contacts.map((contact) => (
              <div
                key={contact.number}
                className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  phoneNumber === contact.number
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleContactSelect(contact.number)}
              >
                <Image
                  src={`https://i.pravatar.cc/48?u=${contact.number}`}
                  alt={contact.name}
                  width={40}
                  height={40}
                  className="rounded-full mx-auto"
                />
                <p className="text-sm font-semibold mt-2 truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-gray-500">{contact.number}</p>
              </div>
            ))}
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-700 mt-4 w-full text-right">
            use another number &gt;
          </button>
        </div>

        {/* Message and Generate Section */}
        <div className="flex flex-col">
          <label
            htmlFor="message"
            className="text-sm font-medium text-gray-700 mb-2 block"
          >
            Message
          </label>
          <Textarea
            id="message"
            value={qrText}
            onChange={(e) => {
              setQrText(e.target.value);
              setIsGenerated(false);
            }}
            placeholder="What's On Your Mind...."
            className="flex-grow min-h-[160px] resize-none"
          />
          <Button
            onClick={handleGenerate}
            className="w-full mt-4 bg-cyan-400 hover:bg-cyan-500 text-white"
          >
            <CloudUpload className="w-5 h-5 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      {isGenerated && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
              <div className="w-full max-w-[200px] aspect-square border-2 rounded-xl p-2">
                <QRCodeCanvas
                  value={qrValue}
                  size={256}
                  style={{ width: "100%", height: "100%" }}
                  level="H"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={qrValue}
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              <Button
                onClick={handleShare}
                className="w-full bg-cyan-400 hover:bg-cyan-500 text-white"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
