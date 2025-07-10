import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
  const { recipientPhoneNumberIds, templateName, templateParams, campaignId, phoneNumberId } = await request.json();

  const session = await getSession();

  if (!session?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const account = await prisma.whatsAppAccount.findFirst({
    where: {
      user: {
        email: session.email
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

  const campaign = await prisma.whatsAppCampaign.findUnique({
    where: { id: campaignId }
  });

  if (!campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
  }

  // Send messages to each recipient
  for (const recipientPhoneNumberId of recipientPhoneNumberIds) {
    try {
      const messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhoneNumberId,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: 'en_US'
          },
          components: [
            {
              type: 'body',
              parameters: campaign.templateParams
            }
          ]
        }
      };

      // Send message via WhatsApp API
      const response = await fetch(
        `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      );

      const result = await response.json();

      // Create message record in database
      await prisma.whatsAppMessage.create({
        data: {
          wamid: result.messages?.[0]?.id,
          status: 'SENT',
          message: campaign.message,
          isOutbound: true,
          recipientId: recipientPhoneNumberId,
          whatsAppPhoneNumberId: account.phoneNumbers[0].id
        }
      });
    } catch (error) {
      console.error(`Error sending message to ${recipientPhoneNumberId}:`, error);
    }

  // Update campaign status to COMPLETED
  await prisma.whatsAppCampaign.update({
    where: { id: campaign.id },
    data: { 
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });
  }
} catch (error) {
    console.error('Error sending template message:', error);
    return NextResponse.json({ error: 'Failed to send template message' }, { status: 500 });
}
}