"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Copy, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

const colors = [
  { name: "pink", bg: "bg-pink-300", border: "border-pink-400" },
  { name: "green", bg: "bg-green-300", border: "border-green-400" },
  { name: "blue", bg: "bg-blue-300", border: "border-blue-400" },
  { name: "yellow", bg: "bg-yellow-300", border: "border-yellow-400" },
];

export default function QrGeneratorCardContent() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [message, setMessage] = useState("");
  const [showQRPanel, setShowQRPanel] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    // Generate WhatsApp URL with the message
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+911234567890?text=${encodedMessage}`;
    setQrUrl(whatsappUrl);
    toast.success("QR Code generated successfully!");
  };

  const handleChevronClick = () => {
    if (!showQRPanel && message.trim()) {
      handleSendMessage();
    } else if (!message.trim()) {
      toast.error("Please enter a message first.");
      return;
    }
    setShowQRPanel(!showQRPanel);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      toast.success("URL copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="bg-white p-6 pb-0">
        {showQRPanel && (
          <div className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm bg-white/30">
            {/* Overlay for QR panel */}
          </div>
        )}
        {/* Color Selection Row */}
        <div className="flex gap-4 mb-6">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color)}
              className={`w-16 h-16 rounded-full ${color.bg} ${
                color.border
              } border-2 transition-all hover:scale-110 ${
                selectedColor.name === color.name
                  ? "ring-2 ring-offset-2 ring-gray-400"
                  : ""
              }`}
            />
          ))}
          <div className="flex-1 flex justify-end items-center">
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Message Input */}
        <div className="">
          <Textarea
            placeholder="Type Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full min-h-[120px] resize-none border-2 border-gray-200 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center pt-6">
          <Button
            onClick={handleChevronClick}
            size="sm"
            variant="outline"
            className="rounded-50 px-4 border-2 hover:bg-gray-50 bg-white flex flex-col items-center"
          >
            {/* <ChevronUp className="w-5 h-5" /> */}
            <span className="text-sm">Generate</span>
          </Button>
        </div>

        {/* QR Code Slide Panel */}
        <div
          className={`absolute inset-x-30 z-30 bottom-0 bg-white border-2 border-gray-300 rounded-t-lg shadow-lg transition-transform duration-300 ease-in-out ${
            showQRPanel ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6 pt-0">
            {/* Close Button */}
            <div
              className={`flex justify-center mb-4 ${
                showQRPanel ? " " : "hidden"
              }`}
            >
              <Button
                onClick={() => setShowQRPanel(false)}
                size="sm"
                variant="outline"
                className="rounded-50 -mt-6 px-4 border-2 border-b-0 rounded-b-none bg-white"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              {/* QR Code */}
              <div className="w-auto h-full border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                {qrUrl ? (
                  <QRCodeCanvas
                    value={qrUrl}
                    size={120}
                    level="H"
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-600 mb-2">
                        QR CODE
                      </div>
                      <div className="text-xs text-gray-500">
                        Scan to open WhatsApp
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Display and Copy */}
              <div className="w-full flex gap-2">
                <Input
                  value={qrUrl}
                  readOnly
                  className="flex-1 text-sm"
                  placeholder="https://wa.me/+91..."
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  disabled={!qrUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
