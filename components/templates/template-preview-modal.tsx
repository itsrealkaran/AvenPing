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
    parameter_format: string;
    components: Array<{
      type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
      format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT";
      text?: string;
      buttons?: Array<{
        type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
        text: string;
        url?: string;
        phone_number?: string;
      }>;
      example?: {
        header_text?: string[];
        body_text?: string[][];
        header_handle?: string[];
      };
    }>;
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

    // Process template components to create proper templateData
    const templateData =
      template.components
        ?.map((component) => {
          if (component.type === "HEADER") {
            if (component.format === "TEXT" && component.text) {
              // Text header - replace variables with example values
              let headerText = component.text;
              if (component.example?.header_text) {
                component.example.header_text.forEach((exampleText, index) => {
                  const placeholder = `{{${index + 1}}}`;
                  headerText = headerText.replace(placeholder, exampleText);
                });
              }
              return {
                type: "HEADER" as const,
                format: "TEXT" as const,
                text: headerText,
              };
            } else if (component.format && component.format !== "TEXT") {
              // Media header - use header_handle for media URLs
              const mediaUrl =
                component.example?.header_handle?.[0] || undefined;
              return {
                type: "HEADER" as const,
                format: component.format as "IMAGE" | "VIDEO" | "DOCUMENT",
                mediaUrl: mediaUrl,
                mediaId: undefined,
              };
            }
          }

          if (component.type === "BODY" && component.text) {
            // Body text - replace variables with example values
            let bodyText = component.text;
            if (component.example?.body_text) {
              component.example.body_text.forEach((exampleArray, index) => {
                if (exampleArray && exampleArray.length > 0) {
                  const placeholder = `{{${index + 1}}}`;
                  bodyText = bodyText.replace(placeholder, exampleArray[0]);
                }
              });
            }
            return {
              type: "BODY" as const,
              text: bodyText,
            };
          }

          if (component.type === "FOOTER" && component.text) {
            return {
              type: "FOOTER" as const,
              text: component.text,
            };
          }

          if (component.type === "BUTTONS" && component.buttons) {
            return {
              type: "BUTTONS" as const,
              buttons: component.buttons,
            };
          }

          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null) ||
      [];

    const message: Message = {
      id: `preview-${template.id}`,
      message: "", // Empty message since we're using templateData
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
      templateData: templateData,
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
