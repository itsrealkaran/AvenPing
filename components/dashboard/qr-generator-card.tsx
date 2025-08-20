"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Copy,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Share2,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { useUser } from "@/context/user-context";
import {
  formatWhatsAppMessage,
  unformatWhatsAppMessage,
  getWhatsAppMessageLength,
  parseWhatsAppFormatting,
  getWhatsAppFormattingClasses,
  WhatsAppFormatting,
} from "@/lib/utils";

const colors = [
  { fg: "text-green-400", bg: "bg-green-300", border: "border-green-400" },
  { fg: "text-blue-400", bg: "bg-blue-300", border: "border-blue-400" },
  { fg: "text-yellow-400", bg: "bg-yellow-300", border: "border-yellow-400" },
  { fg: "text-purple-400", bg: "bg-purple-300", border: "border-purple-400" },
  { fg: "text-orange-400", bg: "bg-orange-300", border: "border-orange-400" },
  { fg: "text-red-400", bg: "bg-red-300", border: "border-red-400" },
  { fg: "text-gray-400", bg: "bg-gray-300", border: "border-gray-400" },
  { fg: "text-teal-400", bg: "bg-teal-300", border: "border-teal-400" },
  { fg: "text-indigo-400", bg: "bg-indigo-300", border: "border-indigo-400" },
  { fg: "text-pink-400", bg: "bg-pink-300", border: "border-pink-400" },
];

export default function QrGeneratorCardContent() {
  const { userInfo, isLoading } = useUser();
  const phoneNumbers: Array<{ id: string; name: string; phoneNumber: string }> =
    userInfo?.whatsappAccount?.phoneNumbers || [];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [message, setMessage] = useState("");
  const [showQRPanel, setShowQRPanel] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [selectedPhone, setSelectedPhone] = useState<string>("");
  const [selectedText, setSelectedText] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (phoneNumbers.length > 0 && !selectedPhone) {
      setSelectedPhone(phoneNumbers[0].phoneNumber);
    }
  }, [phoneNumbers, selectedPhone]);

  const handleTextSelection = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectedText(
      target.value.substring(target.selectionStart, target.selectionEnd)
    );
    setCursorPosition({
      start: target.selectionStart,
      end: target.selectionEnd,
    });
  };

  const applyFormatting = (formatting: WhatsAppFormatting) => {
    if (!selectedText && !message.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    let textToFormat = selectedText || message;
    let newMessage = message;

    if (selectedText) {
      // Format selected text
      const formattedText = formatWhatsAppMessage(selectedText, formatting);
      newMessage =
        message.substring(0, cursorPosition.start) +
        formattedText +
        message.substring(cursorPosition.end);

      // Clear selection
      setSelectedText("");
    } else {
      // Format entire message
      newMessage = formatWhatsAppMessage(message, formatting);
    }

    setMessage(newMessage);
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    const messageLength = getWhatsAppMessageLength(message);
    if (messageLength > 200) {
      toast.error("Message cannot exceed 200 characters.");
      return;
    }

    if (!selectedPhone) {
      toast.error("No WhatsApp number found.");
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const normalizedPhone = selectedPhone.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
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

  const clearFormatting = () => {
    if (message.trim()) {
      const unformatted = unformatWhatsAppMessage(message);
      setMessage(unformatted);
      toast.success("Formatting cleared");
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div className="bg-white px-4 pt-2">
        {showQRPanel && (
          <div className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 backdrop-blur-sm bg-white/30">
            {/* Overlay for QR panel */}
          </div>
        )}

        {/* Phone Numbers Row */}
        <label className="text-sm font-medium text-gray-600">
          Select Phone Number
        </label>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            aria-label="Scroll left"
            className="p-1 rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition"
            onClick={() => {
              const el = document.getElementById("phone-scroll-row");
              if (el) el.scrollBy({ left: -120, behavior: "smooth" });
            }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div
            id="phone-scroll-row"
            className="flex gap-2 overflow-x-auto scrollbar-hide p-2"
            style={{ scrollBehavior: "smooth", minWidth: 0, flex: 1 }}
          >
            {phoneNumbers.length === 0 && !isLoading && (
              <div className="text-sm text-gray-500">
                No WhatsApp numbers found
              </div>
            )}
            {phoneNumbers.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedPhone(p.phoneNumber)}
                className={`flex size-14 ${
                  colors[idx % colors.length].bg
                } items-center justify-center rounded-full border-2 transition-all duration-150 focus:outline-none ${
                  selectedPhone === p.phoneNumber
                    ? `${selectedColor.border}`
                    : "border-transparent"
                }`}
                title={p.phoneNumber}
              >
                <span className="text-md font-semibold text-white">
                  {p.name[0]}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll right"
            className="p-1 rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition"
            onClick={() => {
              const el = document.getElementById("phone-scroll-row");
              if (el) el.scrollBy({ left: 120, behavior: "smooth" });
            }}
          >
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Message Input */}
        <div className="">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-600">Message</label>
            <span
              className={`text-xs ${
                getWhatsAppMessageLength(message) > 200
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {getWhatsAppMessageLength(message)}/200 characters
            </span>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting({ bold: true })}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting({ italic: true })}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting({ strikethrough: true })}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting({ monospace: true })}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Monospace"
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => applyFormatting({ codeBlock: true })}
              className="h-8 w-8 p-0 hover:bg-gray-200"
              title="Code Block"
            >
              <Type className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearFormatting}
              className="h-8 px-2 text-xs hover:bg-gray-200"
              title="Clear Formatting"
            >
              Clear
            </Button>
          </div>

          {/* Rich Text Preview */}
          {message && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Preview:</div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">
                {parseWhatsAppFormatting(message).map((part, index) => (
                  <span
                    key={index}
                    className={getWhatsAppFormattingClasses(part.type)}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Textarea
            placeholder="Type Message... Use formatting buttons above for *bold*, _italic_, ~strikethrough~, `monospace`, and ```code blocks```"
            value={message}
            onChange={(e) => {
              // Limit to 200 characters (including formatting)
              if (getWhatsAppMessageLength(e.target.value) <= 200) {
                setMessage(e.target.value);
              }
            }}
            onSelect={handleTextSelection}
            className="w-full min-h-[120px] resize-none border-2 border-gray-200 rounded-lg p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            rows={3}
          />
        </div>

        {/* Generate Button */}
        <div className="flex flex-col justify-center items-center pt-4 gap-2">
          <Button
            onClick={handleChevronClick}
            size="sm"
            className="w-fit self-center"
            aria-label="Get WA Button Code"
          >
            Generate
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full hover:bg-white border-2 border-b-0 rounded-b-none bg-white"
          >
            <ChevronUp className="w-5 h-5" />
          </Button>
        </div>

        {/* QR Code Slide Panel */}
        <div
          className={`absolute inset-x-10 z-30 bottom-0 bg-white border-2 border-gray-300 rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${
            showQRPanel ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6 pt-4">
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
                className="rounded-full -mt-10 hover:bg-white border-2 border-b-0 rounded-b-none bg-white"
              >
                <ChevronDown className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {/* QR Code */}
              <div className="w-auto h-full border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                {qrUrl ? (
                  <QRCodeCanvas
                    value={qrUrl}
                    size={140}
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
                <div className="flex w-full items-center border-2 border-gray-200 rounded-lg bg-white px-2">
                  <input
                    value={qrUrl}
                    readOnly
                    className="flex-1 text-xs truncate bg-transparent outline-none border-none"
                    placeholder="https://wa.me/+91..."
                  />
                  <Button
                    type="button"
                    onClick={copyToClipboard}
                    size="sm"
                    variant="ghost"
                    disabled={!qrUrl}
                    className=""
                    tabIndex={-1}
                    aria-label="Copy link"
                  >
                    <Copy className="size-2" />
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    // className="rounded-full"
                    disabled={!qrUrl}
                    onClick={() => {
                      if (navigator.share && qrUrl) {
                        navigator
                          .share({
                            title: "WhatsApp Link",
                            url: qrUrl,
                          })
                          .catch(() => {});
                      } else if (qrUrl) {
                        window.open(qrUrl, "_blank");
                      }
                    }}
                  >
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
