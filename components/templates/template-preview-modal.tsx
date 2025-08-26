"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import MessageBubble from "@/components/messages/message-bubble";
import { Message } from "@/components/messages/messages-interface";

interface TemplatePreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: {
    id: string;
    name: string;
    language: string;
    category: string;
    status: string;
    components: any[];
    created_at?: string;
    updated_at?: string;
  } | null;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  open,
  onClose,
  template,
}) => {
  if (!open || !template) return null;

  // Convert template components to message format for preview
  const createPreviewMessage = (): Message => {
    const now = new Date().toISOString();
    const message: Message = {
      id: `preview-${template.id}`,
      message: "",
      isOutbound: false, // Show as inbound for better preview
      status: "DELIVERED",
      createdAt: now,
      updatedAt: now,
      phoneNumber: "0000000000",
      whatsAppPhoneNumberId: "preview-whatsapp-id",
      recipientId: "preview-recipient-id",
      media: [],
      mediaIds: [],
      interactiveJson: [],
      templateData:
        template.components?.map((component: any) => ({
          type: component.type,
          text:
            component.text ||
            component.example ||
            `Sample ${component.type?.toLowerCase?.() || "component"} text`,
          format: component.format || "TEXT",
        })) || [],
    };

    return message;
  };

  const previewMessage = createPreviewMessage();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="relative w-full max-w-2xl mx-auto">
        <Card
          title="Template Preview"
          className="shadow-2xl border-0 p-0"
          headerButton={
            <button
              className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition absolute top-4 right-4"
              onClick={onClose}
              aria-label="Close"
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
          }
        >
          {/* Preview Area */}
          <div
            className="p-6 bg-gray-100 min-h-[400px] flex items-start justify-center"
            style={{
              background: "url('/message-bg.png'), #FFFFD5",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="w-full">
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Preview as received message:
                </p>
              </div>
              {/* Message Bubble Preview */}
              <MessageBubble
                message={previewMessage}
                searchQuery=""
                isCurrentMatch={false}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
