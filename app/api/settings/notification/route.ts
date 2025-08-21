import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationType, isEnabled } = body;

    if (!notificationType || typeof isEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body. notificationType and isEnabled are required.' },
        { status: 400 }
      );
    }

    // Get current user settings
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

    // Update the specific notification setting
    const updatedNotificationSettings = userSettings.notificationSettings.map((setting: any) => {
      if (setting.notificationType === notificationType) {
        return { ...setting, isEnabled };
      }
      return setting;
    });

    // If the notification type doesn't exist, add it
    if (!updatedNotificationSettings.find(setting => setting.notificationType === notificationType)) {
      updatedNotificationSettings.push({ notificationType, isEnabled });
    }

    // Update the user settings
    const updatedSettings = await prisma.userSetting.update({
      where: { userId: session.userId as string },
      data: {
        notificationSettings: updatedNotificationSettings,
      },
    });

    return NextResponse.json({
      message: `${notificationType} notification ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      notificationSettings: updatedSettings.notificationSettings,
    });
  } catch (error) {
    console.error('Error updating notification setting:', error);
    return NextResponse.json(
      { error: 'Failed to update notification setting' },
      { status: 500 }
    );
  }
}

