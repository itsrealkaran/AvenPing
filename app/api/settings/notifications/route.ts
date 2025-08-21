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
    const { settings } = body;

    if (!Array.isArray(settings)) {
      return NextResponse.json(
        { error: 'Invalid request body. settings array is required.' },
        { status: 400 }
      );
    }

    // Validate each setting
    for (const setting of settings) {
      if (!setting.notificationType || typeof setting.isEnabled !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid setting format. Each setting must have notificationType and isEnabled.' },
          { status: 400 }
        );
      }
    }

    // Get current user settings
    let userSettings = await prisma.userSetting.findUnique({
      where: { userId: session.userId as string },
    });

    if (!userSettings) {
      // Create new user settings with the provided notification settings
      userSettings = await prisma.userSetting.create({
        data: {
          userId: session.userId as string,
          isOptOutSelected: false,
          notificationSettings: settings,
        },
      });
    } else {
      // Update existing user settings
      userSettings = await prisma.userSetting.update({
        where: { userId: session.userId as string },
        data: {
          notificationSettings: settings,
        },
      });
    }

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      notificationSettings: userSettings.notificationSettings,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
}

