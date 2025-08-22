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
        return <Check size={14} className="text-[#008D9F]" />;
      case "DELIVERED":
        return <CheckCheck size={14} className="text-[#008D9F]" />;
      case "READ":
        return <CheckCheck size={14} className="text-[#00BCD4]" />;
      case "PENDING":
        return <Clock size={14} className="text-[#1A687D]" />;
      case "FAILED":
        return <AlertCircle size={14} className="text-red-500" />;
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
      <div className="mt-3 space-y-2">
        {message.interactiveJson.map((button, index) => (
          <button
            key={index}
            className="w-full px-3 py-2 bg-[#00BCD4]/10 hover:bg-[#00BCD4]/20 rounded-lg border border-[#00BCD4]/30 text-sm text-[#1A687D] transition-colors"
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
    if (!message.templateData) return null;

    return (
      <div className="mt-2 p-3 bg-[#008D9F]/10 rounded-lg border border-[#008D9F]/30">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={16} className="text-[#008D9F]" />
          <span className="text-sm font-medium text-[#1A687D]">
            Template Message
          </span>
        </div>
        <div className="text-sm text-[#008D9F]">{message.templateData}</div>
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
            <div key={index} className="mb-2">
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
            <div key={index} className="mb-2">
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
            <div key={index} className="mb-2">
              <div className="flex items-center gap-3 p-3 bg-[#00BCD4]/10 rounded-lg border border-[#00BCD4]/30">
                <button
                  onClick={toggleAudioPlayback}
                  className="p-2 rounded-full bg-[#008D9F] text-white hover:bg-[#1A687D] transition-colors"
                >
                  {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-[#008D9F]" />
                    <span className="text-sm font-medium text-[#1A687D]">
                      {media.mediaId.includes("voice-message")
                        ? "Voice Message"
                        : "Audio"}
                    </span>
                  </div>
                  <div className="text-xs text-[#008D9F] mt-1">Tap to play</div>
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
            <div key={index} className="mb-2">
              <div className="flex items-center gap-3 p-3 bg-[#00BCD4]/10 rounded-lg border border-[#00BCD4]/30">
                <FileText size={20} className="text-[#008D9F]" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#1A687D] truncate">
                    {media.mediaId}
                  </div>
                  <div className="text-xs text-[#008D9F]">Document</div>
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
        <div className="mb-2">
          <div className="flex items-center gap-3 p-3 bg-[#00BCD4]/10 rounded-lg border border-[#00BCD4]/30">
            <ImageIcon size={20} className="text-[#008D9F]" />
            <div className="flex-1">
              <div className="text-sm font-medium text-[#1A687D]">
                Media Message
              </div>
              <div className="text-xs text-[#008D9F]">
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
    message.templateData ||
    (message.interactiveJson && message.interactiveJson.length > 0);

  if (!hasContent) {
    return null; // Don't render empty messages
  }

  return (
    <div
      className={`flex ${isMe ? "justify-end" : "justify-start"} group mb-4`}
    >
      <div
        className={`relative max-w-[70%] px-3 py-2 rounded-lg ${
          isMe
            ? "bg-outgoing text-gray-800 rounded-tr-none shadow-[0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] transition-shadow"
            : "bg-white text-gray-800 rounded-tl-none shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-shadow"
        }`}
      >
        {/* Render template message */}
        {renderTemplate()}

        {/* Render media-only message */}
        {renderMediaOnly()}

        {/* Render media content */}
        {renderMedia()}

        {/* Render text message */}
        {message.message && (
          <div className="text-sm">
            {searchQuery
              ? highlightText(message.message, searchQuery)
              : message.message}
          </div>
        )}

        {/* Render interactive buttons */}
        {renderInteractiveButtons()}

        {/* Message footer with time and status */}
        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-[10px] text-[#008D9F]">{time}</span>
          {isMe && renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
