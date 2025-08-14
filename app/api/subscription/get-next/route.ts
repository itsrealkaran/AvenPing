import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const plans = await prisma.plan.findMany();

    const mainPlan = plans.find((plan) => (user.plans as any[]).find((p: any) => p.planName === plan.name));
    const mainPlanJson = {
      ...mainPlan,
      period: (user.plans as any[]).find((p: any) => p.planName === mainPlan?.name)?.period === "MONTHLY" ? "month" : "year",
    }

    const addons = plans.filter((plan) => {
      if (plan.isAddOn) {
        const addon = (user.plans as any[]).find((p: any) => p.planName === plan.name);
        if (addon) {
          return {
            ...plan,
            isActive: true,
          };
        } else {
          return {
            ...plan,
            isActive: false,
          };
        }
      }
    });

    if (!mainPlan) {
      return NextResponse.json(
        {
          activePlan: null,
          allPlans: plans.filter((plan) => plan.isAddOn === false),
          nextPlan: plans.find((plan) => plan.name === "BASIC"),
          addons: addons,
        },
        { status: 200 }
      );
    }

    const nextPlan =
      mainPlan.name === "BASIC"
        ? "PREMIUM"
        : mainPlan.name === "PREMIUM"
        ? "ENTERPRISE"
        : mainPlan.name === "ENTERPRISE"
        ? null
        : null;

    const previousPlan =
      mainPlan.name === "BASIC"
        ? null
        : mainPlan.name === "PREMIUM"
        ? "BASIC"
        : mainPlan.name === "ENTERPRISE"
        ? "PREMIUM"
        : null;

    const nextPlanJson = nextPlan
      ? plans.find((plan) => plan.name === nextPlan)
      : null;
    const previousPlanJson = previousPlan
      ? plans.find((plan) => plan.name === previousPlan)
      : null;

      return NextResponse.json({
        activePlan: mainPlanJson,
        nextPlan: nextPlanJson,
        downgradePlan: previousPlanJson,
        allPlans: plans.filter((plan) => plan.isAddOn === false),
        addons: addons,
      });
  } catch (error) {
    console.error("Error getting next subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
