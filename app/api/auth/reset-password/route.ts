import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import redis from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json()

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ 
        error: "Email, OTP, and new password are required" 
      }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get OTP from Redis
    const redisKey = `forgot_password_otp:${email}`
    const storedOtp = await redis.get(redisKey)

    if (!storedOtp) {
      return NextResponse.json({ error: "OTP expired or not found" }, { status: 400 })
    }

    // Verify OTP
    if (storedOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    // Delete OTP from Redis after successful password reset
    await redis.del(redisKey)

    return NextResponse.json({ 
      message: "Password reset successfully" 
    })

  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ 
      error: "Failed to reset password. Please try again." 
    }, { status: 500 })
  }
}
