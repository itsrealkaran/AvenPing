import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification-service';
import { getSession } from '@/lib/jwt';

// PATCH /api/notifications/[id] - Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token to get user ID
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (action === 'markAsRead') {
      const success = await notificationService.markAsRead(session.userId as string, id);
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Notification marked as read'
        });
      } else {
        return NextResponse.json({
          error: 'Notification not found or access denied'
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      error: 'Invalid action. Use "markAsRead"'
    }, { status: 400 });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications/[id] - Delete a notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token to get user ID
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await notificationService.deleteNotification(session.userId as string, id);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } else {
      return NextResponse.json({
        error: 'Notification not found or access denied'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
