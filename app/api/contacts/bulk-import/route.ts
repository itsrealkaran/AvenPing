import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

interface BulkContactData {
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  group?: string;
  status?: string;
  attributes?: { name: string; value: string }[];
}

interface BulkImportRequest {
  contacts: BulkContactData[];
}

interface BulkImportResponse {
  success: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.email || !session.whatsAppAccountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BulkImportRequest = await request.json();
    const { contacts } = body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: "Contacts array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (contacts.length > 1000) {
      return NextResponse.json(
        { error: "Maximum 1000 contacts can be imported at once" },
        { status: 400 }
      );
    }

    const response: BulkImportResponse = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Process contacts in batches of 10
    const batchSize = 10;
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);
      
      // Process each contact in the batch
      for (let j = 0; j < batch.length; j++) {
        const contactData = batch[j];
        const globalIndex = i + j;
        
        try {
          // Validate required fields
          if (!contactData.name?.trim()) {
            throw new Error("Name is required");
          }
          if (!contactData.phoneNumber?.trim()) {
            throw new Error("Phone number is required");
          }
          if (!contactData.phoneNumberId?.trim()) {
            throw new Error("Phone number ID is required");
          }

          // Clean phone number (remove spaces, dashes, parentheses)
          const cleanPhoneNumber = contactData.phoneNumber.replace(/[\s\-\(\)]/g, '');

          // Check if contact already exists
          const existingContact = await prisma.whatsAppRecipient.findFirst({
            where: {
              phoneNumber: cleanPhoneNumber,
              whatsAppPhoneNumberId: contactData.phoneNumberId,
            },
          });

          if (existingContact) {
            // Update existing contact
            await prisma.whatsAppRecipient.update({
              where: { id: existingContact.id },
              data: {
                name: contactData.name.trim(),
                updatedAt: new Date(),
              },
            });

            // Update attributes if provided
            if (contactData.attributes && contactData.attributes.length > 0) {
              await prisma.whatsAppRecipient.update({
                where: { id: existingContact.id },
                data: {
                  attributeValues: contactData.attributes,
                },
              });
            }
          } else {
            // Create new contact
            const newContact = await prisma.whatsAppRecipient.create({
              data: {
                name: contactData.name.trim(),
                phoneNumber: cleanPhoneNumber,
                whatsAppPhoneNumberId: contactData.phoneNumberId,
                whatsAppAccountId: session.whatsAppAccountId as string,
                hasConversation: false,
                lastCheckedTime: new Date(),
                attributeValues: contactData.attributes || [],
              },
            });
          }

          response.success++;
        } catch (error) {
          response.failed++;
          response.errors.push({
            index: globalIndex,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 