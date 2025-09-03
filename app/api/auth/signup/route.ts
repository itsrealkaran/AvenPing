import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import { sendSignupEmail } from '@/lib/email-utils';

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

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        size,
        industry
      }
    });

    await sendSignupEmail(email, name, industry, size);

    // Create JWT token (new users don't have WhatsApp account yet)
    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      whatsAppAccountId: null,
      hasWhatsAppAccount: false,
      signupStatus: user.signupStatus,
      plan: null,
      expiresAt: null,
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

    response.cookies.set('Authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
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