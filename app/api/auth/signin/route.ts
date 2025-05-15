import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        WhatsAppAccount: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { status: 'error', error: 'Invalid credentials' },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = password === user.password;

    if (!isValidPassword) {
      return NextResponse.json(
        { status: 'error', error: 'Invalid credentials' },
        { status: 404 }
      );
    }

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken: user.WhatsAppAccount[0].accessToken,
    });

    // Set cookie
    const response = NextResponse.json(
      {
        userId: user.id,
        email: user.email,
        name: user.name
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Error in signin:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to sign in' },
      { status: 500 }
    );
  }
} 