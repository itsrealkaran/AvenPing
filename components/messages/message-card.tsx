"use client";

import { ReactNode } from "react";

interface MessageCardProps {
  children: ReactNode;
  className?: string;
}

const MessageCard = ({ children, className = "" }: MessageCardProps) => {
  return (
    <div
      className={`border rounded-lg border-gray-300 bg-white overflow-hidden shadow-xs h-full flex ${className}`}
    >
      {children}
    </div>
  );
};

export default MessageCard;
