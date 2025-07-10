import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import axios from 'axios';

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
    const { name, type, message, templateName, templateParams, scheduledAt, recipientPhoneNumbers, phoneNumberId } = body;

    // recipientPhoneNumbers = [{phoneNumber: '1234567890', phoneNumberId: '1234567890'}]
    if (!name || !type || !recipientPhoneNumbers || !phoneNumberId) {
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
        templateName,
        templateParams,
        accountId: id,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null
      }
    });

    // If campaign is not scheduled, send messages immediately
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/messages/send-template-message`, {
      recipientPhoneNumberIds: recipientPhoneNumbers.map((phoneNumber: any) => phoneNumber.phoneNumberId),
      templateName,
      templateParams: templateParams ? JSON.parse(templateParams) : null,
      campaignId: campaign.id,
      phoneNumberId: phoneNumberId
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
