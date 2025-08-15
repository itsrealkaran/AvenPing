import { NextRequest, NextResponse } from "next/server"
import redis from "@/lib/redis"

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ 
        error: "Email and OTP are required" 
      }, { status: 400 })
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

    // OTP is valid - don't delete it yet, keep it for password reset
    return NextResponse.json({ 
      message: "OTP verified successfully",
      email: email 
    })

  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ 
      error: "Failed to verify OTP. Please try again." 
    }, { status: 500 })
  }
}
