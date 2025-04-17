import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get all audiences for an account
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const audiences = await prisma.whatsAppAudience.findMany({
      where: {
        account: {
          id: params.id,
          user: {
            email: session.email
          }
        }
      },
      include: {
        recipients: true
      }
    });

    return NextResponse.json(audiences);
  } catch (error) {
    console.error('Error fetching audiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audiences' },
      { status: 500 }
    );
  }
}

// Create a new audience
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
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const audience = await prisma.whatsAppAudience.create({
      data: {
        name,
        accountId: params.id
      }
    });

    return NextResponse.json(audience, { status: 201 });
  } catch (error) {
    console.error('Error creating audience:', error);
    return NextResponse.json(
      { error: 'Failed to create audience' },
      { status: 500 }
    );
  }
} 