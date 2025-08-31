import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

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

    const mailOptions = {
      from: "sign-in <sign-in@avenping.com>",
      to: email,
      subject: "🎉 Welcome to AvenPing! Your WhatsApp Automation Journey Begins",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header with Gradient -->
          <div style="background: linear-gradient(135deg, #43A2C9 0%, #667eea 50%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <div style="background: rgba(255, 255, 255, 0.1); border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px; color: white;">🚀</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Welcome to AvenPing!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Your WhatsApp automation platform</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #2d3748; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
              <p style="color: #4a5568; line-height: 1.7; font-size: 16px; margin: 0;">
                Thank you for joining AvenPing! We're excited to have you on board and can't wait to help you transform your WhatsApp communication with powerful automation tools.
              </p>
            </div>

            <!-- Welcome Features -->
            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #43A2C9;">
              <h3 style="color: #2d3748; margin: 0 0 15px; font-size: 18px; font-weight: 600;">🎯 What's Next?</h3>
              <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;"><strong>Complete Your Setup:</strong> Connect your WhatsApp account and configure your preferences</li>
                <li style="margin-bottom: 8px;"><strong>Choose Your Plan:</strong> Select the perfect plan for your business needs</li>
                <li style="margin-bottom: 8px;"><strong>Explore Add-ons:</strong> Enhance your experience with powerful features</li>
                <li style="margin-bottom: 0;"><strong>Start Automating:</strong> Create flows, campaigns, and templates</li>
              </ul>
            </div>

            <!-- Industry Specific Welcome -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #6c757d; margin: 0; font-size: 14px;">
                <strong>Industry:</strong> ${industry} | <strong>Business Size:</strong> ${size}
              </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://app.avenping.com/login" 
                 style="display: inline-block; background: linear-gradient(135deg, #43A2C9 0%, #667eea 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(67, 162, 201, 0.3); transition: all 0.3s ease;">
                🚀 Get Started Now
              </a>
            </div>

            <!-- Support Section -->
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <h4 style="color: #2d3748; margin: 0 0 10px; font-size: 16px; font-weight: 600;">💬 Need Help?</h4>
              <p style="color: #6c757d; margin: 0; font-size: 14px; line-height: 1.6;">
                Our support team is here to help you get started. Reach out anytime!
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #2d3748; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
            <div style="margin-bottom: 15px;">
              <span style="color: #a0aec0; font-size: 14px;">© 2024 AvenPing. All rights reserved.</span>
            </div>
            <div style="margin-bottom: 15px;">
              <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
              <span style="color: #a0aec0; font-size: 12px;">•</span>
              <a href="#" style="color: #a0aec0; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
            </div>
            <div style="color: #718096; font-size: 11px; line-height: 1.5;">
              <p style="margin: 0;">This is an automated welcome email. Please do not reply to this message.</p>
              <p style="margin: 5px 0 0;">If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

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