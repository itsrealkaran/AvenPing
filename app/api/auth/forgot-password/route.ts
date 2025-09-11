import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import redis from "@/lib/redis"
import { sendForgotPasswordEmail } from "@/lib/email-utils"


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in Redis for 5 minutes
    const redisKey = `forgot_password_otp:${email}`
    await redis.setex(redisKey, 300, otp) // 300 seconds = 5 minutes

    // Email content
    await sendForgotPasswordEmail(email, otp);

    return NextResponse.json({ 
      message: "OTP sent successfully",
      email: email 
    })

  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ 
      error: "Failed to send OTP. Please try again." 
    }, { status: 500 })
  }
}
