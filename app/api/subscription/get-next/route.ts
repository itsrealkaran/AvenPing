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
      include: {
        plans: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mainPlan = user.plans.find((plan) => plan.isAddOn === false);

    const plans = await prisma.plan.findMany();

    const addons = plans.filter((plan) => {
      if (plan.isAddOn) {
        const addon = user.plans.find((p) => p.id === plan.id);
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

    if (nextPlan) {
      const plan = plans.find((plan) => plan.name === nextPlan);

      return NextResponse.json({
        activePlan: mainPlan,
        nextPlan: plan,
        addons: addons,
      });
    }

    return NextResponse.json({
      activePlan: mainPlan,
      nextPlan: null,
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
