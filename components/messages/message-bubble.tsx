"use client";

import { Message } from "./messages-interface";
import {
  Check,
  CheckCheck,
  Play,
  Pause,
  Music,
  FileText,
  Image as ImageIcon,
  Clock,
  AlertCircle,
  Bot,
  Reply,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";
import {
  parseWhatsAppFormatting,
  getWhatsAppFormattingClasses,
} from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  searchQuery?: string;
  isCurrentMatch?: boolean;
}

const MessageBubble = ({
  message,
  searchQuery,
  isCurrentMatch,
}: MessageBubbleProps) => {
  const isMe = message.isOutbound;
  const time = format(new Date(message.createdAt), "h:mm a");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const renderStatus = () => {
    switch (message.status) {
      case "SENT":
        return <Check size={14} className="text-white/80" />;
      case "DELIVERED":
        return <CheckCheck size={14} className="text-white/80" />;
      case "READ":
        return <CheckCheck size={14} className="text-white" />;
      case "PENDING":
        return <Clock size={14} className="text-white/70" />;
      case "FAILED":
        return <AlertCircle size={14} className="text-red-300" />;
      default:
        return null;
    }
  };

  // Function to highlight search query in text
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Render formatted WhatsApp message
  const renderFormattedMessage = (text: string, searchQuery?: string) => {
    if (!text) return null;

    // Parse WhatsApp formatting
    const formattedParts = parseWhatsAppFormatting(text);

    return (
      <div className="text-sm">
        {formattedParts.map((part, index) => {
          let classes = getWhatsAppFormattingClasses(part.type);

          // Customize classes based on message type (outbound vs inbound)
          if (isMe) {
            // For outbound messages (cyan background), use white-based backgrounds
            if (part.type === "monospace") {
              classes = "font-mono bg-white/20 px-1.5 py-0.5 rounded text-sm";
            } else if (part.type === "codeBlock") {
              classes =
                "font-mono bg-white/20 px-3 py-2 rounded-lg text-sm block my-2 border border-white/10";
            }
          } else {
            // For inbound messages (white background), use dark-based backgrounds
            if (part.type === "monospace") {
              classes = "font-mono bg-gray-200 px-1.5 py-0.5 rounded text-sm";
            } else if (part.type === "codeBlock") {
              classes =
                "font-mono bg-gray-100 px-3 py-2 rounded-lg text-sm block my-2 border border-gray-200";
            }
          }

          // Apply search highlighting if query exists
          if (searchQuery && part.type === "plain") {
            return (
              <span key={index} className={classes}>
                {highlightText(part.text, searchQuery)}
              </span>
            );
          }

          return (
            <span key={index} className={classes}>
              {part.text}
            </span>
          );
        })}
      </div>
    );
  };

  // Handle audio playback
  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // Render interactive buttons
  const renderInteractiveButtons = () => {
    if (!message.interactiveJson || message.interactiveJson.length === 0)
      return null;

    return (
      <div className="mt-2 space-y-1">
        {message.interactiveJson.map((button, index) => (
          <button
            key={index}
            className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-white transition-colors duration-200"
            onClick={() => {
              // Handle button click - you can implement the logic here
              console.log("Button clicked:", button.label);
            }}
          >
            <span className="flex items-center gap-2 justify-center">
              <Reply size={16} />
              {button.label}
            </span>
          </button>
        ))}
      </div>
    );
  };

  // Render template message
  const renderTemplate = () => {
    if (
      !message.templateData ||
      !Array.isArray(message.templateData) ||
      message.templateData.length === 0
    )
      return null;

    // Use appropriate background colors based on message direction
    const templateBg = isMe ? "bg-white/20" : "bg-gray-100";
    const templateBorder = isMe ? "border-white/10" : "border-gray-200";
    const textColor = isMe ? "text-white" : "text-gray-800";
    const textColorSecondary = isMe ? "text-white/90" : "text-gray-600";
    const textColorTertiary = isMe ? "text-white/70" : "text-gray-500";
    const textColorQuaternary = isMe ? "text-white/60" : "text-gray-400";
    const separatorBorder = isMe ? "border-white/10" : "border-gray-200";

    return (
      <div
        className={`mt-2 p-4 ${templateBg} rounded-lg border ${templateBorder}`}
      >
        <div className={`flex items-center gap-2 mb-3`}>
          <Bot size={16} className={textColor} />
          <span className={`text-sm font-medium ${textColor}`}>
            Template Message
          </span>
        </div>

        <div className="space-y-3">
          {message.templateData.map((section, index) => {
            if (!section.text) return null;

            let sectionClasses = "text-sm";

            // Style different template sections
            switch (section.type) {
              case "HEADER":
                sectionClasses += ` font-semibold ${textColor} text-base leading-tight`;
                break;
              case "BODY":
                sectionClasses += ` ${textColorSecondary} leading-relaxed`;
                break;
              case "FOOTER":
                sectionClasses += ` ${textColorTertiary} text-xs italic pt-2 border-t ${separatorBorder}`;
                break;
              default:
                sectionClasses += ` ${textColorSecondary}`;
            }

            // Handle different formats
            if (section.format === "IMAGE" && section.text) {
              return (
                <div key={index} className="mb-3">
                  <div
                    className={`relative rounded-lg overflow-hidden ${
                      isMe ? "bg-white/10" : "bg-gray-200"
                    }`}
                  >
                    <img
                      src={section.text}
                      alt="Template Image"
                      className="max-w-full max-h-40 w-auto object-cover"
                      onError={(e) => {
                        console.error(
                          "Failed to load template image:",
                          section.text
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              );
            }

            // Handle text format
            if (section.format === "TEXT" || !section.format) {
              return (
                <div key={index} className={sectionClasses}>
                  {section.text}
                </div>
              );
            }

            // Handle document format
            if (section.format === "DOCUMENT" && section.text) {
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 ${
                    isMe ? "bg-white/10" : "bg-gray-200"
                  } rounded`}
                >
                  <FileText size={16} className={textColorQuaternary} />
                  <span className={`text-sm ${textColorSecondary} truncate`}>
                    {section.text}
                  </span>
                </div>
              );
            }

            // Handle video format
            if (section.format === "VIDEO" && section.text) {
              return (
                <div key={index} className="mb-3">
                  <div
                    className={`relative rounded-lg overflow-hidden ${
                      isMe ? "bg-white/10" : "bg-gray-200"
                    }`}
                  >
                    <video
                      src={section.text}
                      controls
                      className="max-w-full max-h-40 w-auto"
                      onError={(e) => {
                        console.error(
                          "Failed to load template video:",
                          section.text
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  };

  // Render media content
  const renderMedia = () => {
    if (!message.media || message.media.length === 0) return null;

    return message.media.map((media, index) => {
      switch (media.type) {
        case "image/jpeg":
        case "image/png":
        case "image/gif":
        case "image/webp":
          return (
            <div key={index} className="mb-2 cursor-pointer">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={
                    media.mediaId.startsWith("data:")
                      ? media.mediaId
                      : media.mediaId
                  }
                  alt="Image"
                  className="max-w-full max-h-60 w-auto object-cover"
                  onError={(e) => {
                    console.error("Failed to load image:", media.mediaId);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          );

        case "video":
          return (
            <div key={index} className="mb-2 cursor-pointer">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <video
                  src={
                    media.mediaId.startsWith("data:")
                      ? media.mediaId
                      : media.mediaId
                  }
                  controls
                  className="max-w-full max-h-60 w-auto"
                  onError={(e) => {
                    console.error("Failed to load video:", media.mediaId);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          );

        case "audio":
          return (
            <div key={index} className="mb-2 cursor-pointer">
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                <button
                  onClick={toggleAudioPlayback}
                  className="p-2 rounded-full bg-white/30 hover:bg-white/40 text-[#00BCD4] transition-colors duration-200"
                >
                  {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-white/80" />
                    <span className="text-sm font-medium text-white">
                      {media.mediaId.includes("voice-message")
                        ? "Voice Message"
                        : "Audio"}
                    </span>
                  </div>
                  <div className="text-xs text-white/70 mt-1">Tap to play</div>
                </div>
                <audio
                  ref={audioRef}
                  src={
                    media.mediaId.startsWith("data:")
                      ? media.mediaId
                      : media.mediaId
                  }
                  onEnded={() => setIsAudioPlaying(false)}
                  onPause={() => setIsAudioPlaying(false)}
                  onError={(e) => {
                    console.error("Failed to load audio:", media.mediaId);
                  }}
                />
              </div>
            </div>
          );

        default:
          return (
            <div key={index} className="mb-2 cursor-pointer">
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                <FileText size={20} className="text-white/80" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white truncate">
                    {media.mediaId}
                  </div>
                  <div className="text-xs text-white/70">Document</div>
                </div>
              </div>
            </div>
          );
      }
    });
  };

  // Render media-only message (when message text is empty but mediaIds exist)
  const renderMediaOnly = () => {
    if (message.mediaIds && message.mediaIds.length > 0 && !message.message) {
      return (
        <div className="mb-2 cursor-pointer">
          <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
            <ImageIcon size={20} className="text-white/80" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                Media Message
              </div>
              <div className="text-xs text-white/70">
                {message.mediaIds.length} media file
                {message.mediaIds.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Check if message has any content to display
  const hasContent =
    message.message ||
    (message.media && message.media.length > 0) ||
    (message.mediaIds && message.mediaIds.length > 0) ||
    (message.templateData &&
      Array.isArray(message.templateData) &&
      message.templateData.length > 0) ||
    (message.interactiveJson && message.interactiveJson.length > 0);

  if (!hasContent) {
    return null; // Don't render empty messages
  }

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} group mb-4`}
    >
      <div
        className={`relative max-w-[70%] px-3 py-2 rounded-2xl ${
          isMe
            ? "bg-[#00BCD4] text-white rounded-br-md shadow-sm"
            : "bg-white text-gray-800 rounded-bl-md border border-gray-200 shadow-sm"
        }`}
      >
        {/* Render template message */}
        {renderTemplate()}

        {/* Render media-only message */}
        {renderMediaOnly()}

        {/* Render media content */}
        {renderMedia()}

        {/* Render text message */}
        {message.message &&
          renderFormattedMessage(message.message, searchQuery)}

        {/* Render interactive buttons */}
        {renderInteractiveButtons()}

        {/* Message footer with time and status */}
        <div className="flex items-center justify-end gap-1 mt-1">
          <span
            className={`text-[11px] ${
              isMe ? "text-white/80" : "text-gray-500"
            }`}
          >
            {time}
          </span>
          {isMe && renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
