import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get audience details
export async function GET(
  request: Request,
  { params }: { params: { id: string; audienceId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      },
      include: {
        recipients: true,
        campaigns: true
      }
    });

    if (!audience) {
      return NextResponse.json(
        { error: 'Audience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(audience);
  } catch (error) {
    console.error('Error fetching audience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audience' },
      { status: 500 }
    );
  }
}

// Update audience
export async function PUT(
  request: Request,
  { params }: { params: { id: string; audienceId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
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

    const updatedAudience = await prisma.whatsAppAudience.update({
      where: { id: params.audienceId },
      data: { name }
    });

    return NextResponse.json(updatedAudience);
  } catch (error) {
    console.error('Error updating audience:', error);
    return NextResponse.json(
      { error: 'Failed to update audience' },
      { status: 500 }
    );
  }
}

// Delete audience
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; audienceId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    await prisma.whatsAppAudience.delete({
      where: { id: params.audienceId }
    });

    return NextResponse.json(
      { message: 'Audience deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting audience:', error);
    return NextResponse.json(
      { error: 'Failed to delete audience' },
      { status: 500 }
    );
  }
} 