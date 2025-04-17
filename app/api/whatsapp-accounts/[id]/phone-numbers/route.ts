import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get all phone numbers for an account
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const account = await prisma.whatsAppAccount.findUnique({
      where: {
        id: params.id,
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

    return NextResponse.json(account.phoneNumbers);
  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone numbers' },
      { status: 500 }
    );
  }
}

// Add a new phone number to the account
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumberId, phoneNumber, name, codeVerificationStatus } = body;

    if (!phoneNumberId || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await prisma.whatsAppAccount.findUnique({
      where: {
        id: params.id,
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

    const phoneNumberRecord = await prisma.whatsAppPhoneNumber.create({
      data: {
        phoneNumberId,
        phoneNumber,
        name,
        codeVerificationStatus,
        accountId: params.id
      }
    });

    return NextResponse.json(phoneNumberRecord, { status: 201 });
  } catch (error) {
    console.error('Error adding phone number:', error);
    return NextResponse.json(
      { error: 'Failed to add phone number' },
      { status: 500 }
    );
  }
} 