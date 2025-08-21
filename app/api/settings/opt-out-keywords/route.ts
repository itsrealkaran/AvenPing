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
    const { keywords } = body;

    if (!keywords || !keywords[0] || !keywords[1]) {
      console.log("keywords", keywords)
      return NextResponse.json(
        { error: 'Invalid request body. Both primary and secondary keywords are required.' },
        { status: 400 }
      );
    }

    // Get current user settings
    let userSettings = await prisma.userSetting.findUnique({
      where: { userId: session.userId as string },
    });

    if (!userSettings) {
      // Create new user settings with the provided opt-out keywords
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
          optOutKeywords: keywords,
        },
      });
    } else {
      // Update existing user settings
      userSettings = await prisma.userSetting.update({
        where: { userId: session.userId as string },
        data: {
          optOutKeywords: keywords,
        },
      });
    }

    return NextResponse.json({
      message: 'Opt-out keywords updated successfully',
      optOutKeywords: userSettings.optOutKeywords,
    });
  } catch (error) {
    console.error('Error updating opt-out keywords:', error);
    return NextResponse.json(
      { error: 'Failed to update opt-out keywords' },
      { status: 500 }
    );
  }
}

