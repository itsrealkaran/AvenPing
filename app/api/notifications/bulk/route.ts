import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification-service';
import { getSession } from '@/lib/jwt';

// POST /api/notifications/bulk - Bulk operations on notifications
export async function POST(request: NextRequest) {
  try {
    // Verify JWT token to get user ID
    const session = await getSession();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'markAllAsRead') {
      const updatedCount = await notificationService.markAllAsRead(session.userId as string);
      
      return NextResponse.json({
        success: true,
        message: `${updatedCount} notifications marked as read`,
        updatedCount
      });
    }

    if (action === 'clearAll') {
      const deletedCount = await notificationService.clearAllNotifications(session.userId as string);
      
      return NextResponse.json({
        success: true,
        message: `${deletedCount} notifications cleared`,
        deletedCount
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use "markAllAsRead" or "clearAll"'
    }, { status: 400 });

  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
