"use client";

import { useState, useRef, useEffect } from "react";
import {
  Smile,
  Paperclip,
  Mic,
  SendHorizontal,
  X,
  Image as ImageIcon,
  FileText,
  Music,
  Film,
  FileSpreadsheet,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();

    // Add click outside listener to close attachment menu
    const handleClickOutside = (event: MouseEvent) => {
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('[data-attachment-button="true"]')
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recorderRef.current && recorderRef.current.state === "recording") {
        recorderRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      setAttachment(null);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleAttachmentClick = () => {
    setShowAttachmentMenu((prev) => !prev);
    setShowEmojiPicker(false);
  };

  const handleAttachmentTypeSelect = (type: string) => {
    setAttachmentType(type);
    setShowAttachmentMenu(false);

    let acceptTypes = "";
    switch (type) {
      case "image":
        acceptTypes = "image/*";
        break;
      case "video":
        acceptTypes = "video/*";
        break;
      case "audio":
        acceptTypes = "audio/*";
        break;
      case "document":
        acceptTypes = ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv";
        break;
      default:
        acceptTypes = "*/*";
    }

    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptTypes;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);

      // Format the file type nicely for the message
      let fileTypeLabel =
        attachmentType.charAt(0).toUpperCase() + attachmentType.slice(1);

      // For this implementation, we'll just add the filename to the message
      setMessage(
        (prev) =>
          prev +
          (prev.length > 0 ? " " : "") +
          `[${fileTypeLabel}: ${file.name}]`
      );
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      recorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        // In a real app, you would upload this audio file and get a URL
        // For now, we'll just add a placeholder to the message
        setMessage("[Voice Message]");

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop());

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start a timer to show recording duration
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting voice recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <div className="relative">
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2">
          <div className="relative">
            <button
              className="absolute top-2 right-2 z-10 bg-gray-200 rounded-full p-1"
              onClick={() => setShowEmojiPicker(false)}
            >
              <X size={16} />
            </button>
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              searchPosition="none"
            />
          </div>
        </div>
      )}

      {showAttachmentMenu && (
        <div
          ref={attachmentMenuRef}
          className="absolute bottom-full mb-2 left-4 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-2 grid grid-cols-1 gap-1 w-48">
            <button
              onClick={() => handleAttachmentTypeSelect("image")}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <ImageIcon size={18} className="text-purple-500" />
              <span>Image</span>
            </button>

            <button
              onClick={() => handleAttachmentTypeSelect("video")}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <Film size={18} className="text-blue-500" />
              <span>Video</span>
            </button>

            <button
              onClick={() => handleAttachmentTypeSelect("audio")}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <Music size={18} className="text-green-500" />
              <span>Audio</span>
            </button>

            <button
              onClick={() => handleAttachmentTypeSelect("document")}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <FileText size={18} className="text-red-500" />
              <span>Document</span>
            </button>

            <hr className="my-1 border-gray-200" />

            <button
              onClick={() => {
                setShowAttachmentMenu(false);
                // Placeholder for template functionality
                onSendMessage("I'm sending a template message");
              }}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition-colors w-full text-left"
            >
              <FileText size={18} className="text-amber-500" />
              <span>Template</span>
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {isRecording ? (
        <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-300 rounded-full">
          <div className="animate-pulse rounded-full bg-red-500 h-2 w-2"></div>
          <span className="text-sm text-gray-700">
            Recording {formatTime(recordingTime)}
          </span>
          <button
            type="button"
            onClick={stopRecording}
            className="ml-auto p-2 bg-gray-200 rounded-full"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              stopRecording();
              inputRef.current?.focus();
            }}
            className="p-2 text-white bg-primary rounded-full hover:bg-primary/80"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            onClick={handleAttachmentClick}
            data-attachment-button="true"
          >
            <Paperclip size={20} />
          </button>

          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
              setShowAttachmentMenu(false);
            }}
          >
            <Smile size={20} />
          </button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full px-4 py-2 rounded-full"
            />
          </div>

          {message.trim() ? (
            <button
              type="submit"
              className="p-2 text-white bg-primary rounded-full hover:bg-primary/80"
            >
              <SendHorizontal size={20} />
            </button>
          ) : (
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              onClick={startRecording}
            >
              <Mic size={20} />
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default MessageInput;
