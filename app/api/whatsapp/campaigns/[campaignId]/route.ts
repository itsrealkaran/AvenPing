import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

// Get campaign details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; campaignId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, campaignId } = await params;

    const campaign = await prisma.whatsAppCampaign.findFirst({
      where: {
        id: campaignId,
        account: {
          id: id,
          user: {
            email: session.email
          }
        }
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

// Delete campaign
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; campaignId: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id, campaignId } = await params;

    const campaign = await prisma.whatsAppCampaign.findFirst({
      where: {
        id: campaignId,
        account: {
          id: id,
          user: {
            email: session.email
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    await prisma.whatsAppCampaign.delete({
      where: { id: campaignId }
    });

    return NextResponse.json(
      { message: 'Campaign deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
} 