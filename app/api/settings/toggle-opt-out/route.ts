import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user settings
    let userSettings = await prisma.userSetting.findUnique({
      where: { userId: session.userId as string },
    });

    if (!userSettings) {
      // Create default settings with opt-out toggled to true
      userSettings = await prisma.userSetting.create({
        data: {
          userId: session.userId as string,
          isOptOutSelected: true,
          notificationSettings: [
            { notificationType: 'email', isEnabled: true },
            { notificationType: 'push', isEnabled: true },
            { notificationType: 'sms', isEnabled: false },
            { notificationType: 'whatsapp', isEnabled: true },
          ],
        },
      });
    } else {
      // Toggle the opt-out setting
      userSettings = await prisma.userSetting.update({
        where: { userId: session.userId as string },
        data: {
          isOptOutSelected: !userSettings.isOptOutSelected,
        },
      });
    }

    return NextResponse.json({
      message: `Opt-out ${userSettings.isOptOutSelected ? 'enabled' : 'disabled'} successfully`,
      isOptOutSelected: userSettings.isOptOutSelected,
    });
  } catch (error) {
    console.error('Error toggling opt-out setting:', error);
    return NextResponse.json(
      { error: 'Failed to toggle opt-out setting' },
      { status: 500 }
    );
  }
}

