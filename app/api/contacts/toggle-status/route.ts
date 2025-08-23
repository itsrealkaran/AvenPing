import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { validateContactLimit } from "@/lib/subscription-utils";

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.email || !session.whatsAppAccountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId } = await request.json();

    if (!contactId) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 });
    }

    // Get the current contact to check its status
    const currentContact = await prisma.whatsAppRecipient.findUnique({
      where: { id: contactId },
      select: { 
        id: true, 
        isDisabled: true,
        whatsAppAccountId: true 
      }
    });

    if (!currentContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // Check if user has access to this contact's WhatsApp account
    if (currentContact.whatsAppAccountId !== session.whatsAppAccountId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

         // Toggle the disabled status (boolean field)
     const newDisabledStatus = !currentContact.isDisabled;
     let updatedContact: any;

     if (newDisabledStatus === true) {
       // Disabling a contact - no validation needed
       updatedContact = await prisma.whatsAppRecipient.update({
         where: { id: contactId },
         data: { isDisabled: newDisabledStatus },
         select: {
           id: true,
           isDisabled: true,
           name: true,
           phoneNumber: true,
           createdAt: true,
           updatedAt: true
         }
       });
     } else {
       // Enabling a contact - need to validate contact limits
       const user = await prisma.user.findUnique({
         where: {
           id: session.userId as string,
         },
       });
       
       if (!user) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
       }

       // Get current count of active contacts
       const totalContacts = await prisma.whatsAppRecipient.count({
         where: {
           whatsAppAccountId: session.whatsAppAccountId as string,
           isDisabled: false
         },
       });

       // Validate contact limit using utility function
       const validation = await validateContactLimit(session, user, totalContacts);
       
       if (!validation.isValid) {
         return NextResponse.json({ error: validation.error }, { status: 400 });
       }

       // Update the contact status
       updatedContact = await prisma.whatsAppRecipient.update({
         where: { id: contactId },
         data: { isDisabled: newDisabledStatus },
         select: {
           id: true,
           isDisabled: true,
           name: true,
           phoneNumber: true,
           createdAt: true,
           updatedAt: true
         }
       });
     }

     return NextResponse.json({
       success: true,
       contact: updatedContact,
       message: `Contact ${newDisabledStatus ? 'disabled' : 'enabled'} successfully`
     });

  } catch (error) {
    console.error("Error toggling contact status:", error);
    return NextResponse.json(
      { error: "Failed to toggle contact status" },
      { status: 500 }
    );
  }
}
