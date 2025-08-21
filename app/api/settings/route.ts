import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings or create default ones if they don't exist
    let userSettings = await prisma.userSetting.findUnique({
      where: { userId: session.userId as string },
    });

    if (!userSettings) {
      // Create default settings
      userSettings = await prisma.userSetting.create({
        data: {
          userId: session.userId as string,
          isOptOutSelected: false,
          notificationSettings: [
            { notificationType: 'email', isEnabled: true },
            { notificationType: 'push', isEnabled: true },
            { notificationType: 'sms', isEnabled: false },
            { notificationType: 'whatsapp', isEnabled: true },
          ],
        },
      });
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isOptOutSelected, notificationSettings } = body;

    // Update or create user settings
    const userSettings = await prisma.userSetting.upsert({
      where: { userId: session.userId as string },
      update: {
        isOptOutSelected: isOptOutSelected !== undefined ? isOptOutSelected : undefined,
        notificationSettings: notificationSettings || undefined,
      },
      create: {
        userId: session.userId as string,
        isOptOutSelected: isOptOutSelected || false,
        notificationSettings: notificationSettings || [
          { notificationType: 'email', isEnabled: true },
          { notificationType: 'push', isEnabled: true },
          { notificationType: 'sms', isEnabled: false },
          { notificationType: 'whatsapp', isEnabled: true },
        ],
      },
    });

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}

