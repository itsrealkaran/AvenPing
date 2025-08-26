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

  // Function to get media preview from WhatsApp API
  const getMediaPreview = async (mediaId: string, mediaType: string) => {
    try {
      console.log(`Fetching preview for ${mediaType} with ID: ${mediaId}`);

      // Call our API route to get media preview
      const response = await fetch(`/api/whatsapp/media/${mediaId}/preview`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Get the media blob from the response
        const mediaBlob = await response.blob();

        // Create a URL for the blob
        const mediaUrl = URL.createObjectURL(mediaBlob);

        console.log(`Media preview loaded for ${mediaType}:`, mediaUrl);

        // Update the UI to show the actual media
        // You can implement state management here to replace the fallback
        // For now, we'll log the success and could trigger a re-render

        // Example: You could update a state variable to trigger re-render
        // setMediaPreview({ mediaId, mediaUrl, mediaType });

        // For immediate display, you could also replace the DOM element
        // This is a simple approach - in a real app you'd use React state
        const mediaElement = document.querySelector(
          `[data-media-id="${mediaId}"]`
        );
        if (mediaElement) {
          if (mediaType === "IMAGE") {
            const img = document.createElement("img");
            img.src = mediaUrl;
            img.className =
              "max-w-full max-h-40 w-auto object-cover rounded-lg";
            img.alt = "Media Preview";
            mediaElement.innerHTML = "";
            mediaElement.appendChild(img);
          } else if (mediaType === "VIDEO") {
            const video = document.createElement("video");
            video.src = mediaUrl;
            video.controls = true;
            video.className = "max-w-full max-h-40 w-auto rounded-lg";
            mediaElement.innerHTML = "";
            mediaElement.appendChild(video);
          }
        }
      } else {
        console.error("Failed to get media preview:", response.statusText);
        // You could show an error message to the user here
      }
    } catch (error) {
      console.error("Error fetching media preview:", error);
      // You could show an error message to the user here
    }
  };

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

  // Render template message as normal message content
  const renderTemplateContent = () => {
    if (
      !message.templateData ||
      !Array.isArray(message.templateData) ||
      message.templateData.length === 0
    )
      return null;

    return (
      <div className="space-y-2">
        {message.templateData.map((section, index) => {
          // HEADER: Media (IMAGE, VIDEO, AUDIO, DOCUMENT)
          if (
            section.type === "HEADER" &&
            section.format &&
            section.format !== "TEXT"
          ) {
            const hasUrl = section.mediaUrl && section.mediaUrl.trim() !== "";
            const label =
              section.format.charAt(0) + section.format.slice(1).toLowerCase();
            if (section.format === "IMAGE") {
              return hasUrl ? (
                <div key={index} className="mb-2">
                  <img
                    src={section.mediaUrl}
                    alt="Message Image"
                    className="max-w-full max-h-40 w-auto object-cover rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
                  onClick={() =>
                    section.mediaId && getMediaPreview(section.mediaId, "IMAGE")
                  }
                  data-media-id={section.mediaId}
                >
                  <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                    <ImageIcon size={20} className="text-white/80" />
                    <div>
                      <div className="text-sm font-medium text-white truncate">
                        Media Message
                      </div>
                      <div className="text-xs text-white/70">
                        Image - Click to load
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (section.format === "VIDEO") {
              return hasUrl ? (
                <div key={index} className="mb-2 cursor-pointer">
                  <video
                    src={section.mediaUrl}
                    controls
                    className="max-w-full max-h-40 w-auto rounded-lg"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
                  onClick={() =>
                    section.mediaId && getMediaPreview(section.mediaId, "VIDEO")
                  }
                  data-media-id={section.mediaId}
                >
                  <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                    <ImageIcon size={20} className="text-white/80" />
                    <div>
                      <div className="text-sm font-medium text-white truncate">
                        Media Message
                      </div>
                      <div className="text-xs text-white/70">
                        Video - Click to load
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (section.format === "AUDIO") {
              return (
                <div key={index} className="mb-2 cursor-pointer">
                  <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                    {hasUrl ? (
                      <button
                        onClick={() => new Audio(section.mediaUrl).play()}
                        className="p-2 rounded-full bg-white/30 hover:bg-white/40 text-[#00BCD4] transition-colors duration-200"
                      >
                        <Play size={16} />
                      </button>
                    ) : (
                      <ImageIcon
                        size={20}
                        className="text-white/80 cursor-pointer"
                        onClick={() =>
                          section.mediaId &&
                          getMediaPreview(section.mediaId, "AUDIO")
                        }
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <Music size={16} className="text-white/80" />
                        <span className="text-sm font-medium text-white">
                          Audio Message
                        </span>
                      </div>
                      <div className="text-xs text-white/70 mt-1">
                        {hasUrl ? "Tap to play" : "Audio - Click icon to load"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (section.format === "DOCUMENT") {
              return (
                <div
                  key={index}
                  className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
                  onClick={() =>
                    !hasUrl &&
                    section.mediaId &&
                    getMediaPreview(section.mediaId, "DOCUMENT")
                  }
                  data-media-id={section.mediaId}
                >
                  <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                    <FileText size={20} className="text-white/80" />
                    <div>
                      <div className="text-sm font-medium text-white truncate">
                        {hasUrl ? section.mediaUrl : "Media Message"}
                      </div>
                      <div className="text-xs text-white/70">
                        {hasUrl ? "Document" : "Document - Click to load"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            // Default media fallback
            return (
              <div
                key={index}
                className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
                onClick={() =>
                  !hasUrl &&
                  section.mediaId &&
                  getMediaPreview(section.mediaId, "MEDIA")
                }
                data-media-id={section.mediaId}
              >
                <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                  <ImageIcon size={20} className="text-white/80" />
                  <div>
                    <div className="text-sm font-medium text-white truncate">
                      {hasUrl ? section.mediaUrl : "Media Message"}
                    </div>
                    <div className="text-xs text-white/70">
                      {hasUrl ? "Media" : "Media - Click to load"}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // HEADER: Text
          if (section.type === "HEADER" && section.text) {
            return (
              <div
                key={index}
                className="text-base font-semibold leading-tight"
              >
                {section.text}
              </div>
            );
          }

          // BODY
          if (section.type === "BODY" && section.text) {
            return (
              <div key={index} className="leading-relaxed">
                {renderFormattedMessage(section.text, searchQuery)}
              </div>
            );
          }

          // FOOTER
          if (section.type === "FOOTER" && section.text) {
            return (
              <div key={index} className="text-sm italic opacity-70">
                {section.text}
              </div>
            );
          }

          // BUTTON
          if (section.type === "BUTTON" && section.buttonText) {
            return (
              <div key={index} className="mt-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    isMe
                      ? "bg-white/30 hover:bg-white/40 text-white border border-white/20"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
                  }`}
                  onClick={() => {
                    if (section.buttonType === "URL" && section.buttonValue) {
                      window.open(section.buttonValue, "_blank");
                    } else if (
                      section.buttonType === "PHONE_NUMBER" &&
                      section.buttonValue
                    ) {
                      window.open(`tel:${section.buttonValue}`);
                    }
                  }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    <Reply size={16} />
                    {section.buttonText}
                  </span>
                </button>
              </div>
            );
          }

          return null;
        })}
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
            <div
              key={index}
              className="mb-2 cursor-pointer"
              data-media-id={media.mediaId}
            >
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
                  onClick={() => {
                    // If mediaId is not a data URL, try to get preview
                    if (!media.mediaId.startsWith("data:")) {
                      getMediaPreview(media.mediaId, "IMAGE");
                    }
                  }}
                />
              </div>
            </div>
          );

        case "video":
          return (
            <div
              key={index}
              className="mb-2 cursor-pointer"
              data-media-id={media.mediaId}
            >
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
                  onClick={() => {
                    // If mediaId is not a data URL, try to get preview
                    if (!media.mediaId.startsWith("data:")) {
                      getMediaPreview(media.mediaId, "VIDEO");
                    }
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
            <div
              key={index}
              className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
              onClick={() => {
                // If mediaId is not a data URL, try to get preview
                if (!media.mediaId.startsWith("data:")) {
                  getMediaPreview(media.mediaId, "DOCUMENT");
                }
              }}
              data-media-id={media.mediaId}
            >
              <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
                <FileText size={20} className="text-white/80" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white truncate">
                    {media.mediaId}
                  </div>
                  <div className="text-xs text-white/70">
                    Document - Click to load preview
                  </div>
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
        <div
          className="mb-2 cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-lg"
          onClick={() => {
            // Try to get preview for the first mediaId
            if (message.mediaIds && message.mediaIds.length > 0) {
              getMediaPreview(message.mediaIds[0], "MEDIA");
            }
          }}
          data-media-id={message.mediaIds?.[0]}
        >
          <div className="flex items-center gap-3 p-3 bg-white/20 rounded-lg">
            <ImageIcon size={20} className="text-white/80" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                Media Message
              </div>
              <div className="text-xs text-white/70">
                {message.mediaIds.length} media file
                {message.mediaIds.length > 1 ? "s" : ""} - Click to load preview
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
            ? "bg-[#00BCD4] text-white rounded-br-none shadow-sm"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm"
        }`}
      >
        {/* Render template content as normal message */}
        {renderTemplateContent()}

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
