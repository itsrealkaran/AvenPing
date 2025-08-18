import { NextRequest, NextResponse } from 'next/server';
import { notificationService, NotificationCreateInput } from '@/lib/notification-service';
import { getSession } from '@/lib/jwt';

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    // Verify JWT token to get user ID
    const session = await getSession();
    console.log('POST /api/notifications - Session:', session);
    
    if (!session || !session.userId) {
      console.log('POST /api/notifications - No session or userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('POST /api/notifications - User ID:', session.userId);

    const body = await request.json();
    const { title, message, type, category, metadata } = body;

    // Validate required fields
    if (!title || !message || !type || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message, type, category' },
        { status: 400 }
      );
    }

    // Validate type and category values
    const validTypes = ['success', 'warning', 'info', 'error'];
    const validCategories = ['chats', 'campaigns', 'planExpiry', 'systemUpdates'];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be one of: success, warning, info, error' },
        { status: 400 }
      );
    }

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be one of: chats, campaigns, planExpiry, systemUpdates' },
        { status: 400 }
      );
    }

    const notificationInput: NotificationCreateInput = {
      userId: session.userId as string,
      title,
      message,
      type,
      category,
      metadata,
    };

    const notification = await notificationService.createNotification(notificationInput);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    // Verify JWT token to get user ID
    const session = await getSession();
    console.log('GET /api/notifications - Session:', session);
    
    if (!session || !session.userId) {
      console.log('GET /api/notifications - No session or userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('GET /api/notifications - User ID:', session.userId);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let notifications;
    
    if (search) {
      notifications = await notificationService.searchNotifications(session.userId as string, search, limit);
    } else if (category && category !== 'all') {
      notifications = await notificationService.getNotificationsByCategory(session.userId as string, category, limit);
    } else {
      notifications = await notificationService.getUserNotifications(session.userId as string, limit, offset);
    }

    const unreadCount = await notificationService.getUnreadCount(session.userId as string);
    const stats = await notificationService.getUserNotificationStats(session.userId as string);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total
      }
    });

  } catch (error) {
    console.error('Error getting notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
