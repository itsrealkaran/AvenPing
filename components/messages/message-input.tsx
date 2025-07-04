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
  Play,
  Pause,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";

interface MessageInputProps {
  onSendMessage: (content: string, media?: { type: string; mediaId: string }) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachment, setAttachment] = useState<{ name: string, type: string, size: number, url?: string, mediaId?: string } | null>(null);
  const [attachmentType, setAttachmentType] = useState<string>("");
  const [attachmentPreview, setAttachmentPreview] = useState<string>("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { userInfo } = useUser();

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
      // Clean up preview URL
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachment) {
      // If there's an attachment, send it with the message
      if (attachment) {
        console.log(attachment, "attachment");
        const mediaData = {
          type: attachmentType,
          mediaId: attachment.mediaId!,
        };
        onSendMessage(message, mediaData);
        clearAttachment();
      } else {
        onSendMessage(message);
      }
      setMessage("");
    }
  };

  const clearAttachment = () => {
    setAttachment(null);
    setAttachmentType("");
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
      setAttachmentPreview("");
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
    setAudioDuration(0);
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({ name: file.name, type: file.type, size: file.size, url: URL.createObjectURL(file) });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("phoneNumberId", userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId || "");

      // Create preview URL for images and videos
      if (attachmentType === "image" || attachmentType === "video" || attachmentType === "document" || attachmentType === "audio") {

        const mediaId = await axios.post("/api/whatsapp/upload-file", formData,  {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (mediaId.status !== 200) {
          toast.error("Failed to upload file");
          throw new Error("Failed to upload file");
        }

        setAttachment({ name: file.name, type: attachmentType, size: file.size, mediaId: mediaId.data.mediaId });
        setAttachmentType(attachmentType);
        setAttachmentPreview(URL.createObjectURL(file));
      }

      // Handle audio files
      if (attachmentType === "audio") {
        const audioUrl = URL.createObjectURL(file);
        setAttachmentPreview(audioUrl);
        
        // Get audio duration
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
          setAudioDuration(audio.duration);
        });
        audioRef.current = audio;
      }
    }
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
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

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        const formData = new FormData();
        formData.append("file", audioBlob, "voice-message.mp3");
        formData.append("phoneNumberId", userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId || "");

        // Set as attachment (optional, for preview/UI)
        setAttachment({ name: "voice-message.mp3", type: "audio/mp3", size: audioBlob.size, url: audioUrl });
        setAttachmentType("audio");
        setAttachmentPreview(audioUrl);
        
        // Get audio duration
        const audio = new Audio(audioUrl);
        audio.addEventListener('loadedmetadata', () => {
          setAudioDuration(audio.duration);
        });
        audioRef.current = audio;

        // Stop all tracks from the stream
        stream.getTracks().forEach((track) => track.stop());

        // Upload the audio file to the backend
        const mediaId = await axios.post("/api/whatsapp/upload-file", formData,  {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (mediaId.status !== 200) {
          toast.error("Failed to upload file");
          throw new Error("Failed to upload file");
        }

        // Send the WhatsApp message with the uploaded audio
        await onSendMessage("", { type: "audio", mediaId: mediaId.data.mediaId });

        // Optionally reset attachment state if needed
        setAttachment(null);
        setAttachmentType("");
        setAttachmentPreview("");

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

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  // Render media preview
  const renderMediaPreview = () => {
    if (!attachment || !attachmentPreview) return null;

    return (
      <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-3">
          {/* Media Preview */}
          <div className="flex-shrink-0">
            {attachmentType === "image" && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={attachmentPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {attachmentType === "video" && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 relative">
                <video
                  src={attachmentPreview}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <Play size={20} className="text-white" />
                </div>
              </div>
            )}
            
            {attachmentType === "audio" && (
              <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                <Music size={24} className="text-green-600" />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {attachment.name}
            </div>
            <div className="text-xs text-gray-500">
              {attachmentType === "audio" && audioDuration > 0 && (
                <span>{formatTime(audioDuration)} • </span>
              )}
              {(attachment.size / 1024 / 1024).toFixed(2)} MB
            </div>
            
            {/* Audio Controls */}
            {attachmentType === "audio" && (
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={toggleAudioPlayback}
                  className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600"
                >
                  {isAudioPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <div className="text-xs text-gray-600">
                  {isAudioPlaying ? "Playing..." : "Tap to play"}
                </div>
              </div>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={clearAttachment}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
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
            Recording {formatRecordingTime(recordingTime)}
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
        <div>
          {/* Media Preview */}
          {renderMediaPreview()}
          
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
                placeholder={attachment ? "Add a caption..." : "Type a message"}
                className="w-full px-4 py-2 rounded-full"
              />
            </div>

            {(message.trim() || attachment) ? (
              <button
                type="submit"
                onClick={handleSubmit}
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
        </div>
      )}
    </div>
  );
};

export default MessageInput;
