import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get recipient details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; audienceId: string; recipientId: string }> }
) {
  try {
    const session = await getSession();
    const { id, audienceId, recipientId } = await params;
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recipient = await prisma.whatsAppRecipient.findFirst({
      where: {
        id: recipientId,
        audience: {
          id: audienceId,
          account: {
            id: id,
            user: {
              email: session.email
            }
          }
        }
      },
      include: {
        messages: true
      }
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recipient);
  } catch (error) {
    console.error('Error fetching recipient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipient' },
      { status: 500 }
    );
  }
}

// Update recipient
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; audienceId: string; recipientId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, audienceId, recipientId } = await params;
    const { name, phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const recipient = await prisma.whatsAppRecipient.findFirst({
      where: {
        id: recipientId,
        audience: {
          id: audienceId,
          account: {
            id: id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    const updatedRecipient = await prisma.whatsAppRecipient.update({
      where: { id: recipientId },
      data: {
        name,
        phoneNumber
      }
    });

    return NextResponse.json(updatedRecipient);
  } catch (error) {
    console.error('Error updating recipient:', error);
    return NextResponse.json(
      { error: 'Failed to update recipient' },
      { status: 500 }
    );
  }
}

// Delete recipient
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; audienceId: string; recipientId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, audienceId, recipientId } = await params;
    const recipient = await prisma.whatsAppRecipient.findFirst({
      where: {
        id: recipientId,
        audience: {
          id: audienceId,
          account: {
            id: id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }

    await prisma.whatsAppRecipient.delete({
      where: { id: recipientId }
    });

    return NextResponse.json(
      { message: 'Recipient deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting recipient:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipient' },
      { status: 500 }
    );
  }
} 