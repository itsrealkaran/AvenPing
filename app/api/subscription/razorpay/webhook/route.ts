import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!signature) {
      return NextResponse.json({ message: "Signature not found" }, { status: 400 })
    }

    // Verify webhook signature using official Razorpay utility
    try {
      validateWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!)
    } catch (error) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity)
        break
      case "order.paid":
        await handleOrderPaid(event.payload.order.entity)
        break
      default:
        console.log(`Unhandled event: ${event.event}`)
    }

    return NextResponse.json({ message: "Webhook processed successfully" })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 })
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Get the order details
    const orderId = payment.order_id
    const paymentId = payment.id

    // Fetch order details from Razorpay
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await instance.orders.fetch(orderId)
    const userId = order.notes?.userId as string
    const planId = order.notes?.planId as string
    const planName = order.notes?.planName as string
    const planPeriod = order.notes?.planPeriod as string
    const endDate = new Date(order.notes?.endDate as string)

    if (userId && planId && payment.status === "captured") {
      // Get current user plans
      const userPlans = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          plans: true,
        },
      })

      const existingPlans = (userPlans?.plans as any[]) || []
      
      // Remove existing BASIC, PREMIUM, ENTERPRISE plans
      const basicPlanIndex = existingPlans.findIndex((p: any) => p.planName === "BASIC")
      const premiumPlanIndex = existingPlans.findIndex((p: any) => p.planName === "PREMIUM")
      const enterprisePlanIndex = existingPlans.findIndex((p: any) => p.planName === "ENTERPRISE")
      
      if (basicPlanIndex !== -1) {
        existingPlans.splice(basicPlanIndex, 1)
      }
      if (premiumPlanIndex !== -1) {
        existingPlans.splice(premiumPlanIndex, 1)
      }
      if (enterprisePlanIndex !== -1) {
        existingPlans.splice(enterprisePlanIndex, 1)
      }
      
      // Add the new plan
      const newPlans = [...existingPlans, {
        planName: planName,
        period: planPeriod,
        isAddOn: false,
        endDate: endDate,
      }]

      // Update user's plan
      await prisma.user.update({
        where: { id: userId },
        data: {
          plans: newPlans,
          expiresAt: endDate,
        },
      })

      // Update subscription status
      await prisma.subscription.updateMany({
        where: {
          userId: userId,
          endDate: {
            gte: new Date(),
          },
        },
        data: {
          endDate: endDate,
        },
      })

      console.log(`Payment captured for user ${userId}, plan ${planId}`)
    }
  } catch (error) {
    console.error("Error handling payment captured:", error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    const orderId = payment.order_id
    
    // Fetch order details from Razorpay
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await instance.orders.fetch(orderId)
    const userId = order.notes?.userId as string
    const planId = order.notes?.planId as string

    if (userId && planId) {
      // Update subscription status to inactive
      await prisma.subscription.updateMany({
        where: {
          userId: userId,
          endDate: {
            gte: new Date(),
          },
        },
        data: {
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      })

      console.log(`Payment failed for user ${userId}, plan ${planId}`)
    }
  } catch (error) {
    console.error("Error handling payment failed:", error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    const userId = order.notes?.userId as string
    const planId = order.notes?.planId as string
    const planName = order.notes?.planName as string
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
      // Get current user plans
      const userPlans = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          plans: true,
        },
      })

      const existingPlans = (userPlans?.plans as any[]) || []
      
      // Remove existing BASIC, PREMIUM, ENTERPRISE plans
      const basicPlanIndex = existingPlans.findIndex((p: any) => p.planName === "BASIC")
      const premiumPlanIndex = existingPlans.findIndex((p: any) => p.planName === "PREMIUM")
      const enterprisePlanIndex = existingPlans.findIndex((p: any) => p.planName === "ENTERPRISE")
      
      if (basicPlanIndex !== -1) {
        existingPlans.splice(basicPlanIndex, 1)
      }
      if (premiumPlanIndex !== -1) {
        existingPlans.splice(premiumPlanIndex, 1)
      }
      if (enterprisePlanIndex !== -1) {
        existingPlans.splice(enterprisePlanIndex, 1)
      }
      
      // Add the new plan
      const newPlans = [...existingPlans, {
        planName: planName,
        period: planPeriod,
        isAddOn: false,
        endDate: expiryDate,
      }]

      // Update user's plan
      await prisma.user.update({
        where: { id: userId },
        data: {
          plans: newPlans,
          expiresAt: expiryDate,
        },
      })

      // Update subscription status
      await prisma.subscription.updateMany({
        where: {
          userId: userId,
          endDate: {
            gte: new Date(),
          },
        },
        data: {
          endDate: expiryDate,
        },
      })

      console.log(`Order paid for user ${userId}, plan ${planId}`)
    }
  } catch (error) {
    console.error("Error handling order paid:", error)
  }
} 