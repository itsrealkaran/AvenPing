import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get phone number details
export async function GET(
  request: Request,
  { params }: { params: { id: string; phoneNumberId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phoneNumber = await prisma.whatsAppPhoneNumber.findFirst({
      where: {
        id: params.phoneNumberId,
        account: {
          id: params.id,
          user: {
            email: session.email
          }
        }
      }
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(phoneNumber);
  } catch (error) {
    console.error('Error fetching phone number:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone number' },
      { status: 500 }
    );
  }
}

// Update phone number
export async function PUT(
  request: Request,
  { params }: { params: { id: string; phoneNumberId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, codeVerificationStatus, isRegistered, isSubscribed } = body;

    const phoneNumber = await prisma.whatsAppPhoneNumber.findFirst({
      where: {
        id: params.phoneNumberId,
        account: {
          id: params.id,
          user: {
            email: session.email
          }
        }
      }
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      );
    }

    const updatedPhoneNumber = await prisma.whatsAppPhoneNumber.update({
      where: { id: params.phoneNumberId },
      data: {
        name,
        codeVerificationStatus,
        isRegistered,
        isSubscribed
      }
    });

    return NextResponse.json(updatedPhoneNumber);
  } catch (error) {
    console.error('Error updating phone number:', error);
    return NextResponse.json(
      { error: 'Failed to update phone number' },
      { status: 500 }
    );
  }
}

// Delete phone number
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; phoneNumberId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const phoneNumber = await prisma.whatsAppPhoneNumber.findFirst({
      where: {
        id: params.phoneNumberId,
        account: {
          id: params.id,
          user: {
            email: session.email
          }
        }
      }
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number not found' },
        { status: 404 }
      );
    }

    await prisma.whatsAppPhoneNumber.delete({
      where: { id: params.phoneNumberId }
    });

    return NextResponse.json(
      { message: 'Phone number deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting phone number:', error);
    return NextResponse.json(
      { error: 'Failed to delete phone number' },
      { status: 500 }
    );
  }
} 