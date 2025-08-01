import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken, getSession } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get updated user data with WhatsApp account
    const user = await prisma.user.findUnique({
      where: {
        email: session.email as string,
      },
      include: {
        whatsAppAccount: {
          include: {
            phoneNumbers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has WhatsApp account with phone numbers
    const hasWhatsAppAccount = Boolean(
      user.whatsAppAccount?.id && 
      user.whatsAppAccount.phoneNumbers && 
      user.whatsAppAccount.phoneNumbers.length > 0
    );

    // Create new JWT token with updated WhatsApp status
    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      accessToken: user.whatsAppAccount?.accessToken,
      hasWhatsAppAccount: hasWhatsAppAccount,
    });

    // Set updated cookie
    const response = NextResponse.json(
      { 
        success: true, 
        hasWhatsAppAccount 
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
    console.error('Error updating WhatsApp status:', error);
    return NextResponse.json(
      { error: 'Failed to update WhatsApp status' },
      { status: 500 }
    );
  }
} 