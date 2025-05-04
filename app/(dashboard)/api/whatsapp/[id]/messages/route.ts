import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import type { Prisma } from '@prisma/client';

// Get all messages for an account with pagination
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
    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '20');
    const take = Math.min(limit, 100); // Maximum 100 messages per request

    // Build the query
    const query: Prisma.WhatsAppMessageFindManyArgs = {
      where: {
        whatsAppPhoneNumber: {
          account: {
            id: id,
            user: {
              email: session.email
            }
          }
        }
      },
      include: {
        recipient: true,
        whatsAppPhoneNumber: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: take + 1 // Take one extra to check if there are more results
    };

    // Add cursor if provided
    if (cursor) {
      query.where = {
        ...query.where,
        createdAt: {
          lt: new Date(cursor)
        }
      };
    }

    const messages = await prisma.whatsAppMessage.findMany(query);

    // Check if there are more results
    const hasMore = messages.length > take;
    const items = hasMore ? messages.slice(0, take) : messages;

    // Get the cursor for the next page
    const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// Create a new message
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
    const { phoneNumberId, recipientId, message, templateId, templateParams } = body;

    if (!phoneNumberId || !recipientId || (!message && !templateId)) {
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
      }
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Get phone number details
    const phoneNumber = await prisma.whatsAppPhoneNumber.findUnique({
      where: { id: phoneNumberId }
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      );
    }

    // Get recipient details
    const recipient = await prisma.whatsAppRecipient.findUnique({
      where: { id: recipientId }
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    // Create message in database
    const newMessage = await prisma.whatsAppMessage.create({
      data: {
        message,
        isOutbound: true,
        status: 'PENDING',
        phoneNumber: recipient.phoneNumber,
        whatsAppPhoneNumberId: phoneNumberId,
        recipientId
      }
    });

    // Send message via WhatsApp API
    try {
      const messageData = templateId ? {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient.phoneNumber,
        type: 'template',
        template: {
          name: templateId,
          language: {
            code: 'en_US'
          },
          components: [
            {
              type: 'body',
              parameters: templateParams
            }
          ]
        }
      } : {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipient.phoneNumber,
        type: 'text',
        text: {
          body: message
        }
      };

      const response = await fetch(
        `https://graph.facebook.com/v17.0/${phoneNumber.phoneNumberId}/messages`,
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

      // Update message with WhatsApp ID and status
      await prisma.whatsAppMessage.update({
        where: { id: newMessage.id },
        data: {
          wamid: result.messages?.[0]?.id,
          status: 'SENT',
          sentAt: new Date()
        }
      });

      return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
      // Update message with error status
      await prisma.whatsAppMessage.update({
        where: { id: newMessage.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      throw error;
    }
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
} 