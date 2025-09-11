import { createToken, getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId as string
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.userId,
      }
    })

    const freeTrial = subscriptions.find((subscription) => subscription.planName === "freeTrial")

    if (freeTrial) {
      return NextResponse.json({ error: "Free trial already redeemed" }, { status: 404 })
    }

    await prisma.subscription.create({
      data: {
        userId: session.userId as string,
        planName: "freeTrial",
        period: "FREE_TRIAL",
        amount: 0,
        currency: "USD",
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })

    const plan = [{
      planName: "BASIC",
      period: "FREE_TRIAL",
      isAddOn: false,
      quantity: 0,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }]

    await prisma.user.update({
      where: {
        id: session.userId as string
      },
      data: {
        plans: plan,
        signupStatus: "COMPLETED"
      }
    })

    session.signupStatus = "COMPLETED"
    session.plan = plan

    const token = await createToken(session)

    const response = NextResponse.json({ success: true })

    response.cookies.set('Authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response
    
  } catch (error) {
    console.error("Error fetching free trial:", error);
    return NextResponse.json({ error: "Failed to fetch free trial" }, { status: 500 });
  }
}