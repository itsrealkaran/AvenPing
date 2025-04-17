import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import type { Prisma } from '@/app/generated/prisma';

// Get automation details
export async function GET(
  request: Request,
  { params }: { params: { id: string; automationId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const automation = await prisma.whatsAppAutomation.findFirst({
      where: {
        id: params.automationId,
        phoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      },
      include: {
        phoneNumber: true
      }
    });

    if (!automation) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(automation);
  } catch (error) {
    console.error('Error fetching automation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch automation' },
      { status: 500 }
    );
  }
}

// Update automation
export async function PUT(
  request: Request,
  { params }: { params: { id: string; automationId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, automationJson } = body;

    const automation = await prisma.whatsAppAutomation.findFirst({
      where: {
        id: params.automationId,
        phoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!automation) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      );
    }

    const updatedAutomation = await prisma.whatsAppAutomation.update({
      where: { id: params.automationId },
      data: {
        name,
        automationJson,
      },
      include: {
        phoneNumber: true
      }
    });

    return NextResponse.json(updatedAutomation);
  } catch (error) {
    console.error('Error updating automation:', error);
    return NextResponse.json(
      { error: 'Failed to update automation' },
      { status: 500 }
    );
  }
}

// Delete automation
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; automationId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const automation = await prisma.whatsAppAutomation.findFirst({
      where: {
        id: params.automationId,
        phoneNumber: {
          account: {
            id: params.id,
            user: {
              email: session.email
            }
          }
        }
      }
    });

    if (!automation) {
      return NextResponse.json(
        { error: 'Automation not found' },
        { status: 404 }
      );
    }

    await prisma.whatsAppAutomation.delete({
      where: { id: params.automationId }
    });

    return NextResponse.json(
      { message: 'Automation deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting automation:', error);
    return NextResponse.json(
      { error: 'Failed to delete automation' },
      { status: 500 }
    );
  }
} 