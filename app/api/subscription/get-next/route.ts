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

    const userPlans = (user.plans as any[]) || [];
    const mainPlan = plans.find((plan) => userPlans.find((p: any) => p.planName?.toUpperCase() === plan.name?.toUpperCase()));
    const mainPlanJson = {
      ...mainPlan,
      period: userPlans.find((p: any) => p.planName?.toUpperCase() === mainPlan?.name?.toUpperCase())?.period === "MONTHLY" ? "month" : "year",
    }

    const addons = plans
      .filter((plan) => plan.isAddOn)
      .map((plan) => {
        const addon = userPlans.find((p: any) => p.planName?.toUpperCase() === plan.name?.toUpperCase());
        if (addon) {
          return {
            ...plan,
            isActive: true,
            quantity: addon.quantity !== null && addon.quantity !== undefined ? addon.quantity : 1,
          };
        } else {
          return {
            ...plan,
            isActive: false,
            quantity: null,
          };
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
