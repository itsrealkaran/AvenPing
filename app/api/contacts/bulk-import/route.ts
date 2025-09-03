import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { validateContactLimit } from "@/lib/subscription-utils";

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

    // Get user info for validation
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId as string,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get current count of active contacts
    const currentActiveContacts = await prisma.whatsAppRecipient.count({
      where: {
        whatsAppAccountId: session.whatsAppAccountId as string,
        isDisabled: false
      },
    });

    // Initialize response
    const response: BulkImportResponse = {
      success: 0,
      failed: 0,
      errors: []
    };

    // Validate if all contacts can be imported
    const validation = await validateContactLimit(session, user, currentActiveContacts);
    
    let contactsToProcess = contacts;
    
    if (!validation.isValid) {
      // Check how many contacts can actually be imported
      const maxContacts = validation.maxContacts || 0;
      const availableSlots = maxContacts - currentActiveContacts;
      
      if (availableSlots <= 0) {
        return NextResponse.json({ 
          error: validation.error,
          canImport: 0,
          requested: contacts.length
        }, { status: 400 });
      }
      
      // Limit contacts to available slots
      const contactsToImport = contacts.slice(0, availableSlots);
      const contactsToSkip = contacts.slice(availableSlots);
      
      // Add errors for contacts that can't be imported
      response.errors.push(
        ...contactsToSkip.map((_, index) => ({
          index: availableSlots + index,
          error: `Contact limit reached. Only ${availableSlots} contacts can be imported.`
        }))
      );
      
      // Update the contacts array to only process what can be imported
      contactsToProcess = contactsToImport;
    }

    // Process contacts in batches of 10
    const batchSize = 20;
    for (let i = 0; i < contactsToProcess.length; i += batchSize) {
      const batch = contactsToProcess.slice(i, i + batchSize);
      
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

    return NextResponse.json({
      ...response,
      requested: contacts.length,
      processed: contactsToProcess.length,
      skipped: contacts.length - contactsToProcess.length
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 