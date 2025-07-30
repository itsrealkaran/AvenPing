import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { getSession } from "@/lib/jwt"
import { PlanPeriod } from "@prisma/client"
import crypto from "crypto"

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { planName, planPeriod }: { planName: string; planPeriod: string } = await request.json()
    
    // Get the session to get user email
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Find the plan
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName.toUpperCase(),
        // period: planPeriod as PlanPeriod,
      },
    })

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    // Get plan price in INR (assuming priceJson contains INR amount)
    const planPrice = plan.priceJson as any
    const amountInPaise = Math.round(parseFloat(planPrice.INR) * 100) // Convert to paise

    // Create Razorpay order
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        planPeriod: plan.period,
        userEmail: user.email,
      },
    })

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    })

    return NextResponse.json({ 
      message: "Order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      subscriptionId: subscription.id,
    })
  } catch (error) {
    console.error("Razorpay error:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("razorpay_payment_id")
    const orderId = searchParams.get("razorpay_order_id")
    const signature = searchParams.get("razorpay_signature")

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json({ message: "Payment verification parameters are required" }, { status: 400 })
    }

    // Verify the payment signature
    const text = `${orderId}|${paymentId}`
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (generatedSignature !== signature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    // Verify payment with Razorpay
    const payment = await instance.payments.fetch(paymentId)

    if (payment.status === "captured") {
      // Get the order details
      const order = await instance.orders.fetch(orderId)
      const userId = order.notes?.userId as string
      const planId = order.notes?.planId as string
      const planPeriod = order.notes?.planPeriod as string
      let expiryDate;

      if (planPeriod === "MONTHLY") {
        expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
      } else if (planPeriod === "YEARLY") {
        expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)        
      } else {
        return NextResponse.json({ message: "Invalid plan period" }, { status: 400 })
      }

      if (userId && planId) {
        // Update user's plan
        await prisma.user.update({
          where: { id: userId },
          data: {
            planId: planId,
            expiresAt: expiryDate,
          },
        })

        // Update subscription status
        await prisma.subscription.updateMany({
          where: {
            userId: userId,
            planId: planId,
            status: "PENDING",
          },
          data: {
            status: "ACTIVE",
          },
        })
      }

      return NextResponse.json({ 
        message: "Payment successful",
        payment: payment,
        order: order
      })
    } else {
      return NextResponse.json({ 
        message: "Payment not completed",
        payment: payment 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 })
  }
}
