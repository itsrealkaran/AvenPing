import { prisma } from "./prisma";

// Helper function to store WhatsApp message in database
export async function storeWhatsAppMessage({
  recipientId,
  phoneNumber,
  mediaIds,
  wamid,
  isOutbound = false,  // Default to false (incoming) if not specified
  templateData,
  message,
  timestamp,
  status = "PENDING",
  whatsAppPhoneNumberId,
  errorMessage,
}: {
  recipientId: string;
  phoneNumber: string;
  mediaIds?: string[];
  wamid?: string;
  isOutbound?: boolean;
  templateData?: Array<{
    type: "HEADER" | "BODY" | "FOOTER" | "BUTTON" | "BUTTONS";
    text?: string;
    mediaUrl?: string;
    mediaId?: string;
    format?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
    buttonText?: string;
    buttonType?: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
    buttonValue?: string;
    // New fields for BUTTONS structure
    buttons?: Array<{
      type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
  message: string;
  timestamp: number;
  status?: "PENDING" | "SENT" | "DELIVERED" | "READ" | "FAILED";
  whatsAppPhoneNumberId: string;
  errorMessage?: string;
}) {
  try {
    const newMessage = await prisma.whatsAppMessage.create({
      data: {
        recipientId,
        phoneNumber,
        mediaIds,
        wamid,
        isOutbound,  // This will now always have a value
        templateData,
        message,
        sentAt: new Date(timestamp * 1000),
        status,
        whatsAppPhoneNumberId,
        errorMessage,
      },
    });
    
    console.log(`Message stored successfully with ID: ${newMessage.id}, isOutbound: ${isOutbound}`);
    return newMessage;
  } catch (error) {
    console.error("Error storing WhatsApp message:", error);
    throw error;
  }
}