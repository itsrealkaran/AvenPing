import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { contacts, templateName, variables, campaignId, phoneNumberId } = await request.json();
    console.log("contacts", contacts)
    console.log("templateName", templateName)
    console.log("variables", variables)
    console.log("campaignId", campaignId)
    console.log("phoneNumberId", phoneNumberId)

    const session = await getSession();

    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          id: session.userId
        },
        phoneNumbers: {
          some: {
            phoneNumberId: phoneNumberId
          }
        }
      },
      include: {
        phoneNumbers: true
      }
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    let campaignStats: {
      id: string;
      name: string;
      phoneNumber: string;
      status: string;
    }[] = [];

    // Send messages to each contact
    for (const contact of contacts) {
      try {
        // Build personalized template parameters for this contact
        const headerParams: any[] = [];
        const bodyParams: any[] = [];
        variables.forEach((variable: any) => {
          let paramValue = variable.value || variable.fallbackValue || "";
          if (variable.useAttribute && variable.attributeName) {
            // Find the attribute value for this contact
            const attr = contact.attributeValues?.find((a: any) => a.name === variable.attributeName);
            paramValue = attr?.value || variable.fallbackValue || "";
          }
          const param = {
            type: "text",
            text: paramValue,
          };
          if (variable.componentType === "HEADER") {
            headerParams.push(param);
          } else if (variable.componentType === "BODY") {
            bodyParams.push(param);
          }
        });

        // Build the template structure for this contact
        const templateStructure = {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          type: "template",
          to: contact.phoneNumber.replace(/[^\d]/g, ''),
          template: {
            name: templateName,
            language: {
              code: "en_US",
            },
            components: [] as any[],
          },
        };
        if (headerParams.length > 0) {
          templateStructure.template.components.push({ type: "header", parameters: headerParams });
        }
        if (bodyParams.length > 0) {
          templateStructure.template.components.push({ type: "body", parameters: bodyParams });
        }

        // Send message via WhatsApp API
        const response = await fetch(
          `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${account.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(templateStructure)
          }
        );

        const result = await response.json();

        console.log("result from send template message", result)

        if (result.error) {
          await prisma.whatsAppMessage.create({
            data: {
              wamid: result.error.message_id,
              status: "FAILED",
              message: result.error.message,
              recipientId: contact.id,
              whatsAppPhoneNumberId: account.phoneNumbers[0].id,
            },
          });

          await prisma.whatsAppRecipient.update({
            where: { id: contact.id },
            data: {
              status: "UNDELIVERED",
              activeCampaignId: campaignId,
            },
          });

          campaignStats.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: "UNDELIVERED",
          });
        } else {
          // Create message record in database
          await prisma.whatsAppMessage.create({
            data: {
              wamid: result.messages?.[0]?.id,
              status: "SENT",
              message: result.messages?.[0]?.text?.body,
              isOutbound: true,
              recipientId: contact.id,
              whatsAppPhoneNumberId: account.phoneNumbers[0].id,
            },
          });
          await prisma.whatsAppRecipient.update({
            where: { id: contact.id },
            data: {
              status: "UNREAD",
              activeCampaignId: campaignId,
              hasConversation: true,
            },
          });

          campaignStats.push({
            id: contact.id,
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            status: "UNREAD",
          });
        }
      } catch (error) {
        console.error(`Error sending message to ${contact.phoneNumber}:`, error);
      }
    }
    // Update campaign status to COMPLETED
    await prisma.whatsAppCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        recipientStats: campaignStats
      }
    });
    return NextResponse.json({ message: 'Messages sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending template message:', error);
    return NextResponse.json({ error: 'Failed to send template message' }, { status: 500 });
  }
}