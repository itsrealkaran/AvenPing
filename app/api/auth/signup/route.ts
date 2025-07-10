import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, confirm_password, size, industry } = body;

    // Validate required fields
    if (!name || !email || !password || !confirm_password || !size || !industry) {
      return NextResponse.json(
        { status: 'error', error: 'All fields are required', fields: { name: name ? true : false, email: email ? true : false, password: password ? true : false, confirm_password: confirm_password ? true : false, size: size ? true : false, industry: industry ? true : false } },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirm_password) {
      return NextResponse.json(
        { status: 'error', error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { status: 'error', error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        size,
        industry
      }
    });

    // Create JWT token (new users don't have WhatsApp account yet)
    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      hasWhatsAppAccount: false,
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
    console.error('Error in signup:', error);
    return NextResponse.json(
      { status: 'error', error: 'Failed to create account' },
      { status: 500 }
    );
  }
} 