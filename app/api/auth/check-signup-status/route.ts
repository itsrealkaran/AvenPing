import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, getSession } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getSession();

    console.log(session, "session from check-signup-status");
    
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's current signup status
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: { signupStatus: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.signupStatus === 'PAID') {
      // Update session with signupStatus
      session.signupStatus = user.signupStatus;
      // set the token in the cookie
      const token = await createToken(session);
  
      // Set cookie
      const response = NextResponse.json(
        {
          signupStatus: user.signupStatus
        },
        { status: 200 }
      );
  
      response.cookies.set('Authorization', token, {
        httpOnly: true,
        secure: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        maxAge: 60 * 60 * 24 // 24 hours
      });
  
      return response;
    }

    return NextResponse.json({
      signupStatus: user.signupStatus
    });

  } catch (error) {
    console.error('Error checking signup status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
