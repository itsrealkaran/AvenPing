"use client";

import { Message } from "./messages-interface";
import { Check, CheckCheck, Play, Pause, Music, FileText, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";

interface MessageBubbleProps {
  message: Message;
  searchQuery?: string;
  isCurrentMatch?: boolean;
}

const MessageBubble = ({ message, searchQuery, isCurrentMatch }: MessageBubbleProps) => {
  const isMe = message.isOutbound;
  const time = format(new Date(message.createdAt), "h:mm a");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const renderStatus = () => {
    switch (message.status) {
      case "SENT":
        return <Check size={14} className="text-gray-400" />;
      case "DELIVERED":
        return <CheckCheck size={14} className="text-gray-400" />;
      case "READ":
        return <CheckCheck size={14} className="text-blue-500" />;
      default:
        return null;
    }
  };

  // Function to highlight search query in text
  const highlightText = (text: string, query: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
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

  // Render media content
  const renderMedia = () => {
    console.log(message.media, "message.media");
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
                  src={media.mediaId.startsWith('data:') ? media.mediaId : media.mediaId}
                  alt="Image"
                  className="max-w-full max-h-60 w-auto object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', media.mediaId);
                    e.currentTarget.style.display = 'none';
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
                  src={media.mediaId.startsWith('data:') ? media.mediaId : media.mediaId}
                  controls
                  className="max-w-full max-h-60 w-auto"
                  onError={(e) => {
                    console.error('Failed to load video:', media.mediaId);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          );
        
        case "audio":
          return (
            <div key={index} className="mb-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  onClick={toggleAudioPlayback}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  {isAudioPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Music size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {media.mediaId.includes("voice-message") ? "Voice Message" : "Audio"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Tap to play
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  src={media.mediaId.startsWith('data:') ? media.mediaId : media.mediaId}
                  onEnded={() => setIsAudioPlaying(false)}
                  onPause={() => setIsAudioPlaying(false)}
                  onError={(e) => {
                    console.error('Failed to load audio:', media.mediaId);
                  }}
                />
              </div>
            </div>
          );
        
        default:
          return (
            <div key={index} className="mb-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <FileText size={20} className="text-gray-500" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 truncate">
                    {media.mediaId}
                  </div>
                  <div className="text-xs text-gray-500">
                    Document
                  </div>
                </div>
              </div>
            </div>
          );
      }
    });
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} group`}>
      <div
        className={`relative max-w-[70%] px-3 py-2 rounded-lg ${
          isMe
            ? "bg-outgoing text-gray-800 rounded-tr-none shadow-[0_2px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.08)] transition-shadow"
            : "bg-white text-gray-800 rounded-tl-none shadow-[0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition-shadow"
        }`}
      >
        {/* Render media content */}
        {renderMedia()}

        {/* Render text message */}
        {message.message && (
          <div className="text-sm">
            {searchQuery ? highlightText(message.message, searchQuery) : message.message}
          </div>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500">{time}</span>
          {isMe && renderStatus()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
