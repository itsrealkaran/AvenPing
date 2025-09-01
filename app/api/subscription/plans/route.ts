import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch all plans from the database
    const plans = await prisma.plan.findMany({
      where: {
        isAddOn: false // Only fetch primary plans, not addons
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform the plans to match the expected format
    const transformedPlans = plans.map(plan => {
      // Parse the price JSON strings from the database
      let monthlyPriceJson: { US?: number; IND?: number; ASIA?: number } = {};
      let yearlyPriceJson: { US?: number; IND?: number; ASIA?: number } = {};

      try {
        // Parse JSON strings and clean up any \r\n characters
        monthlyPriceJson = JSON.parse(
          String(plan.monthlyPriceJson).replace(/\r\n/g, '')
        );
      } catch (error) {
        console.warn(`Failed to parse monthlyPriceJson for plan ${plan.id}:`, error);
        monthlyPriceJson = {};
      }

      try {
        // Parse JSON strings and clean up any \r\n characters
        yearlyPriceJson = JSON.parse(
          String(plan.yearlyPriceJson).replace(/\r\n/g, '')
        );
      } catch (error) {
        console.warn(`Failed to parse yearlyPriceJson for plan ${plan.id}:`, error);
        yearlyPriceJson = {};
      }

      return {
        id: plan.id,
        name: plan.name,
        monthlyPriceJson: {
          US: monthlyPriceJson.US || 0,
          IND: monthlyPriceJson.IND || 0,
          ASIA: monthlyPriceJson.ASIA || 0
        },
        yearlyPriceJson: {
          US: yearlyPriceJson.US || 0,
          IND: yearlyPriceJson.IND || 0,
          ASIA: yearlyPriceJson.ASIA || 0
        },
        features: plan.features && plan.features.length > 0 
          ? plan.features 
          : [],
        isAddOn: plan.isAddOn
      };
    });

    // sort the plans by order BASIC, PREMIUM, ENTERPRISE
    transformedPlans.sort((a, b) => {
      if (a.name === "BASIC") return -1;
      if (a.name === "PREMIUM") return 0;
      if (a.name === "ENTERPRISE") return 1;
      return 0;
    });

    console.log("Transformed plans:", transformedPlans);

    return NextResponse.json({
      plans: transformedPlans,
      success: true
    });

  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
