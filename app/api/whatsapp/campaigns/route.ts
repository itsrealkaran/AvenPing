import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get all campaigns for an account
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const campaigns = await prisma.whatsAppCampaign.findMany({
      where: {
        account: {
          id: id,
          user: {
            email: session.email
          }
        }
      },
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// Create and send a new campaign
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;

    const body = await request.json();
    const { name, type, message, mediaUrl, templateId, templateParams, audienceId, scheduledAt } = body;

    if (!name || !type || !audienceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get account details for WhatsApp API
    const account = await prisma.whatsAppAccount.findUnique({
      where: {
        id: id,
        user: {
          email: session.email
        }
      },
      include: {
        phoneNumbers: true
      }
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Create campaign in database
    const campaign = await prisma.whatsAppCampaign.create({
      data: {
        name,
        type,
        message,
        mediaUrl,
        templateId,
        templateParams,
        accountId: id,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });

    // If campaign is not scheduled, send messages immediately
    if (!scheduledAt) {
      await sendCampaignMessages(account, campaign);
    }

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// Helper function to send campaign messages
async function sendCampaignMessages(
  account: any,
  campaign: any
) {
  const accessToken = account.accessToken;
  const phoneNumberId = account.phoneNumbers[0]?.phoneNumberId;

  if (!phoneNumberId) {
    throw new Error('No phone number available for sending messages');
  }

  // Update campaign status to ACTIVE
  await prisma.whatsAppCampaign.update({
    where: { id: campaign.id },
    data: { status: 'ACTIVE' }
  });

  // Send messages to each recipient
    try {
      const messageData = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: account.phoneNumbers[0]?.phoneNumber,
        type: 'template',
        template: {
          name: campaign.templateId,
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
        `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
          recipientId: account.phoneNumbers[0]?.id,
          whatsAppPhoneNumberId: account.phoneNumbers[0]?.id
        }
      });
    } catch (error) {
      console.error(`Error sending message to ${account.phoneNumbers[0]?.phoneNumber}:`, error);
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