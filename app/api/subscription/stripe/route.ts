import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSession } from "@/lib/jwt"
import { PlanPeriod } from "@prisma/client"
import { getPricingDetails } from "@/lib/get-pricing-details"

interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { planName, planPeriod, region }: { planName: string; planPeriod: string; region: string } = await request.json()
    
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

    const planPeriodEnum = planPeriod === "YEARLY" ? "year" : "month"
    console.log(planPeriod, "planPeriod")
    console.log(planPeriodEnum, "planPeriodEnum")

    // Get pricing details using the integrated function
    const pricingDetails = await getPricingDetails(planName, planPeriodEnum, region as keyof PriceJson, user.plans as any)

    if (!pricingDetails) {
      return NextResponse.json({ message: "Unable to calculate pricing for this plan" }, { status: 400 })
    }

    // If it's a plan downgrade, return error
    if (pricingDetails.price === null) {
      return NextResponse.json({ message: "Plan downgrade not allowed" }, { status: 400 })
    }

    // Find the plan for additional metadata
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName,
      },
    })

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    // Determine currency based on region
    const currency = region === "US" ? "usd" : region === "IND" ? "inr" : region === "ASIA" ? "usd" : "usd"

    console.log("Price:", pricingDetails.price, "Currency:", currency, "Period:", planPeriod)

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: plan.name,
              description: `Subscription to ${plan.name} plan`,
            },
            unit_amount: Math.round((pricingDetails.price || 0) * 100), // Convert to cents
            recurring: {
              interval: planPeriod === "YEARLY" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        planPeriod: planPeriod,
        endDate: pricingDetails.endDate.toString()
      },
    })

    return NextResponse.json({ 
      message: "Checkout session created successfully",
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ message: "Failed to create checkout session" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ message: "Session ID is required" }, { status: 400 })
    }

    // Retrieve the session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Update user's plan
      const userId = session.metadata?.userId
      const planId = session.metadata?.planId
      const planName = session.metadata?.planName
      const planPeriod = session.metadata?.planPeriod

      if (userId && planId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plans: {
              push: {
                planName: planName,
                period: planPeriod,
                isAddOn: false,
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            },
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        })
      }

      return NextResponse.json({ 
        message: "Payment successful",
        session: session 
      })
    } else {
      return NextResponse.json({ 
        message: "Payment not completed",
        session: session 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("Error retrieving session:", error)
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 })
  }
}