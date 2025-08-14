import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { planName, planPeriod }: { planName: string; planPeriod: string } = await request.json()
    
    // Get the session to get user ID
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: {
        id: true,
        plans: true,
        expiresAt: true
      }
    })

    const primaryPlan: any = user?.plans.find((p: any) => p.planName === "BASIC" || p.planName === "PREMIUM" || p.planName === "ENTERPRISE")

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Find the plan to downgrade to
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName,
      },
    })

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 })
    }

    // Get current user plans
    const existingPlans = (user.plans as any[]) || []
    
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

    // Calculate new expiration date based on plan period
    const expiresAt = new Date()
    
    if (planPeriod === "YEARLY") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    } else {
      // Default to monthly
      expiresAt.setMonth(expiresAt.getMonth() + 1)
    }

    // Add the new downgraded plan
    const newPlans = [...existingPlans, {
      planName: planName,
      period: planPeriod,
      isAddOn: false,
      endDate: primaryPlan?.endDate,
    }]

    // Update user with new plan
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plans: newPlans,
        expiresAt: primaryPlan?.endDate,
      },
    })

    console.log(`Downgraded user ${user.id} to plan ${planName} for ${planPeriod} period`)

    return NextResponse.json({ 
      message: "Plan downgraded successfully",
      newPlan: {
        planName,
        period: planPeriod,
        expiresAt
      }
    })

  } catch (error) {
    console.error("Downgrade error:", error)
    return NextResponse.json({ message: "Failed to downgrade plan" }, { status: 500 })
  }
}
