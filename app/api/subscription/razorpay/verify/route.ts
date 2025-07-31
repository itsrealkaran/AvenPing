import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils"

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { order_id, payment_id, signature } = await request.json()

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json({ 
        message: "Missing required parameters" 
      }, { status: 400 })
    }

    // Verify the payment signature using official Razorpay utility
    try {
      validatePaymentVerification(
        { order_id, payment_id },
        signature,
        process.env.RAZORPAY_KEY_SECRET!
      )
    } catch (error) {
      return NextResponse.json({ 
        message: "Invalid signature" 
      }, { status: 400 })
    }

    // Fetch payment details from Razorpay
    const payment = await instance.payments.fetch(payment_id)
    const order = await instance.orders.fetch(order_id)

    if (payment.status === "captured") {
      const userId = order.notes?.userId as string
      const planId = order.notes?.planId as string

      if (userId && planId) {
        // Update user's plan
        await prisma.user.update({
          where: { id: userId },
          data: {
            planId: planId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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

        return NextResponse.json({
          message: "Payment verified successfully",
          payment: {
            id: payment.id,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
          },
          order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
          },
        })
      } else {
        return NextResponse.json({ 
          message: "Invalid order data" 
        }, { status: 400 })
      }
    } else {
      return NextResponse.json({ 
        message: "Payment not completed",
        status: payment.status 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ 
      message: "Failed to verify payment" 
    }, { status: 500 })
  }
} 