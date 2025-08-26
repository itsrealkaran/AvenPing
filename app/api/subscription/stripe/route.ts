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
    const { planName, planPeriod, region, isAddon, months, quantity, redirectUrl }: { 
      planName: string; 
      planPeriod: string; 
      region: string;
      isAddon?: boolean;
      months?: number;
      quantity?: number;
      redirectUrl?: string;
    } = await request.json()
    
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

    let pricingDetails;
    let totalPrice;
    
    if (isAddon) {
      // For addons, calculate price based on months
      const monthlyPrice = await getPricingDetails(planName, "month", region as keyof PriceJson, user.plans as any, true, months)
      if (!monthlyPrice) {
        return NextResponse.json({ message: "Unable to calculate pricing for this addon" }, { status: 400 })
      }
      totalPrice = monthlyPrice.price || 0
      pricingDetails = {
        price: monthlyPrice.price,
        endDate: monthlyPrice.endDate
      }
    } else {
      // For regular plans, use existing logic
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
              name: isAddon ? `${plan.name} Addon (${quantity || 1} × ${months || 1} months)` : plan.name,
              description: isAddon ? `${quantity || 1} × ${months || 1} month${(months || 1) > 1 ? 's' : ''} access to ${plan.name} addon` : `Subscription to ${plan.name} plan`,
            },
            unit_amount: Math.round((totalPrice || 0) * 100), // Convert to cents
            recurring: isAddon ? undefined : {
              interval: planPeriod === "YEARLY" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: isAddon ? "payment" : "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${redirectUrl ? `${redirectUrl}?status=registered&success=true&session_id={CHECKOUT_SESSION_ID}` : "/settings?success=true&session_id={CHECKOUT_SESSION_ID}"}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
        planPeriod: planPeriod,
        endDate: pricingDetails.endDate.toString(),
        isAddon: isAddon ? "true" : "false",
        months: (months || 1).toString(),
        quantity: (quantity || 1).toString()
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
      const endDate = session.metadata?.endDate
      const quantity = parseInt(session.metadata?.quantity || "1")
      const months = parseInt(session.metadata?.months || "1")
      const isAddon = session.metadata?.isAddon

      if (userId && planId) {
        const userPlans = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            plans: true,
          },
        })
  
        const existingPlans = (userPlans?.plans as any[]) || []
        
        if (isAddon) {
          // For addons, remove the existing plan with same name and add a new one
          const filteredPlans = existingPlans.filter((p: any) => p.planName !== planName)
          const newPlans = [...filteredPlans, {
            planName: planName,
            period: null,
            isAddOn: true,
            quantity: quantity,
            endDate: endDate,
          }]
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              plans: newPlans,
            },
          })
          
          console.log(`Updated user ${userId} with addon ${planName} for ${quantity} × ${months} months`)
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
          
          const newPlans = [...existingPlans, {
            planName: planName,
            period: planPeriod,
            isAddOn: false,
            quantity: null,
            endDate: endDate,
          }]
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              plans: newPlans,
              expiresAt: endDate,
            },
          })
          
          console.log(`Updated user ${userId} with plan ${planId} for ${planPeriod} period`)
        }
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