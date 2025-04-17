import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get message details
export async function GET(
  request: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const message = await prisma.whatsAppMessage.findFirst({
      where: {
        id: params.messageId,
        whatsAppPhoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      },
      include: {
        recipient: true,
        whatsAppPhoneNumber: true
      }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// Update message status
export async function PUT(
  request: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const message = await prisma.whatsAppMessage.findFirst({
      where: {
        id: params.messageId,
        whatsAppPhoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    const updateData: any = { status };

    // Update relevant timestamps based on status
    if (status === 'SENT') {
      updateData.sentAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    } else if (status === 'READ') {
      updateData.readAt = new Date();
    }

    const updatedMessage = await prisma.whatsAppMessage.update({
      where: { id: params.messageId },
      data: updateData
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// Delete message
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const message = await prisma.whatsAppMessage.findFirst({
      where: {
        id: params.messageId,
        whatsAppPhoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    await prisma.whatsAppMessage.delete({
      where: { id: params.messageId }
    });

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
} 