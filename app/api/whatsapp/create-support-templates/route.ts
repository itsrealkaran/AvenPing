import { NextRequest, NextResponse } from 'next/server';
import { ensureSupportTemplates } from '@/lib/support-templates';
import { getSession } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const user = await getSession();
    
    if (!user || !user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId as string;

    // Ensure support templates are created
    const result = await ensureSupportTemplates(userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: result.message 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating support templates:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const user = await getSession();
    
    if (!user || !user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.userId as string;

    // Check if support templates exist
    const result = await ensureSupportTemplates(userId);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      templatesExist: result.success
    });
  } catch (error) {
    console.error('Error checking support templates:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
