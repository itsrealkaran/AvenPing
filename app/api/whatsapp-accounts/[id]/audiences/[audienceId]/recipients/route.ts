import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get all recipients in an audience
export async function GET(
  request: Request,
  { params }: { params: { id: string; audienceId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const recipients = await prisma.whatsAppRecipient.findMany({
      where: {
        audience: {
          id: params.audienceId,
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    return NextResponse.json(recipients);
  } catch (error) {
    console.error('Error fetching recipients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipients' },
      { status: 500 }
    );
  }
}

// Add recipients to an audience
export async function POST(
  request: Request,
  { params }: { params: { id: string; audienceId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipients } = body; // Array of { phoneNumber, name? }

    if (!recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { error: 'Recipients array is required' },
        { status: 400 }
      );
    }

    const audience = await prisma.whatsAppAudience.findFirst({
      where: {
        id: params.audienceId,
        account: {
          id: params.id,
          user: {
            email: session.email
          }
        }
      }
    });

    if (!audience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    const createdRecipients = await prisma.$transaction(
      recipients.map(recipient =>
        prisma.whatsAppRecipient.create({
          data: {
            phoneNumber: recipient.phoneNumber,
            name: recipient.name,
            audienceId: params.audienceId
          }
        })
      )
    );

    return NextResponse.json(createdRecipients, { status: 201 });
  } catch (error) {
    console.error('Error adding recipients:', error);
    return NextResponse.json(
      { error: 'Failed to add recipients' },
      { status: 500 }
    );
  }
} 