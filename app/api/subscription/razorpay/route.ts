import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { getSession } from "@/lib/jwt"
import { PlanPeriod } from "@prisma/client"
import { getPricingDetails } from "@/lib/get-pricing-details"
import { getTotalContactsOrFlows } from "@/lib/subscription-utils"
import crypto from "crypto"

interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { planName, planPeriod, region, isAddon, months, quantity, redirectUrl }: { 
      planName: string; 
      planPeriod: string; 
      region: string;
      isAddon?: boolean;
      months?: number;
      quantity?: number;
      redirectUrl?: string;
    } = await request.json()

    if (!planName || !planPeriod || !region) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 })
    }
    
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

    let pricingDetails;
    let totalPrice;
    
    if (isAddon) {
      // For addons, calculate price based on months
      const monthlyPrice = await getPricingDetails(planName, "month", region as keyof PriceJson, user.plans as any, true, months)
      if (!monthlyPrice) {
        return NextResponse.json({ message: "Unable to calculate pricing for this addon" }, { status: 400 })
      }
      totalPrice = (monthlyPrice.price || 0) * (months || 1) * (quantity || 1)
      pricingDetails = {
        price: totalPrice,
        endDate: new Date(Date.now() + (months || 1) * 30 * 24 * 60 * 60 * 1000)
      }
    } else {
      // For regular plans, use existing logic
      const planPeriodEnum = planPeriod === "YEARLY" ? "year" : "month"
      pricingDetails = await getPricingDetails(planName, planPeriodEnum, region as keyof PriceJson, user.plans as any, false)
      if (!pricingDetails) {
        return NextResponse.json({ message: "Unable to calculate pricing for this plan" }, { status: 400 })
      }
      // If it's a plan downgrade, return error
      if (pricingDetails.price === null) {
        return NextResponse.json({ message: "Plan downgrade not allowed" }, { status: 400 })
      }
      totalPrice = pricingDetails.price
    }

    // Find the plan for additional metadata
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName.toUpperCase(),
      },
    })

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    // Determine currency based on region
    const currency = region === "US" ? "USD" : region === "IND" ? "INR" : region === "ASIA" ? "USD" : "USD"

    console.log("Price:", totalPrice, "Currency:", currency, "Period:", planPeriod, "IsAddon:", isAddon, "Months:", months)

    const amountInPaise = Math.round((totalPrice || 0) * 100) // Convert to paise

    // Create Razorpay order
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        planPeriod: planPeriod,
        userEmail: user.email,
        endDate: pricingDetails.endDate.toString(),
        isAddon: isAddon ? "true" : "false",
        months: (months || 1).toString(),
        quantity: (quantity || 1).toString()
      },
    })

    // Create subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planName: plan.name,
        period: isAddon ? "MONTHLY" : (planPeriod as PlanPeriod),
        amount: amountInPaise,
        currency: currency,
        endDate: pricingDetails.endDate,
      },
    })

    return NextResponse.json({ 
      message: "Order created successfully",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      subscriptionId: subscription.id,
      redirectUrl: redirectUrl,
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
      const planName = order.notes?.planName as string
      const planPeriod = order.notes?.planPeriod as string
      const endDate = new Date(order.notes?.endDate as string)
      const quantity = parseInt(order.notes?.quantity as string || "1")
      const months = parseInt(order.notes?.months as string || "1")
      const isAddon = order.notes?.isAddon === "true"

      if (userId && planId && payment.status === "captured") {
        const isAddon = order.notes?.isAddon === "true"
        const months = parseInt(order.notes?.months as string || "1")
        const quantity = parseInt(order.notes?.quantity as string || "1")
        
        // Get current user plans
        const userPlans = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            signupStatus: true,
            plans: true,
          },
        })
  
        const signupStatus = userPlans?.signupStatus === "COMPLETED" ? "COMPLETED" : "PAID"

        const existingPlans = (userPlans?.plans as any[]) || []
        
        if (isAddon) {
          const addonPlan = existingPlans.find((p: any) => p.planName === planName && new Date(p.endDate) > new Date())
          if (addonPlan) {
            const addonMaxLimit = getTotalContactsOrFlows(planName, quantity + addonPlan.quantity)

            addonPlan.quantity = addonPlan.quantity + quantity
            addonPlan.endDate = endDate
            await prisma.user.update({
              where: { id: userId },
              data: {
                plans: existingPlans,
                ...(addonMaxLimit || {}),
              },
            })
            return
          }

          // For addons, remove the existing plan with same name and add a new one
          const filteredPlans = existingPlans.filter((p: any) => p.planName !== planName)
          const addonMaxLimit = getTotalContactsOrFlows(planName, quantity)
          const newPlans = [...filteredPlans, {
            planName: planName || "Unknown",
            period: null,
            quantity: quantity,
            isAddOn: true,
            endDate: endDate,
          }]
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              plans: newPlans,
              ...(addonMaxLimit || {}),
            },
          })
        } else {
          // For regular plans, remove existing BASIC, PREMIUM, ENTERPRISE plans
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
            quantity: null,
            isAddOn: false,
            endDate: endDate,
          }]
  
          // Update user's plan
          await prisma.user.update({
            where: { id: userId },
            data: {
              plans: newPlans,
              expiresAt: endDate,
              signupStatus: signupStatus,
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
        }
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
