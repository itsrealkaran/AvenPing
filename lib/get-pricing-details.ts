import { prisma } from "./prisma"

interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

interface Plan {
  id: string
  name: string
  monthlyPriceJson: PriceJson | null
  yearlyPriceJson: PriceJson | null
  isAddOn: boolean
}

interface UserPlan {
  id: string
  name: string
  period: "month" | "year"
  endDate: string
}

function isPlanDowngrade(primaryPlanName: string, planName: string) {
  // Define plan hierarchy (higher index = higher tier)
  const planHierarchy = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
  
  const currentIndex = planHierarchy.indexOf(primaryPlanName);
  const targetIndex = planHierarchy.indexOf(planName);
  
  // If target plan is lower in hierarchy, it's a downgrade
  return targetIndex < currentIndex;
}

export async function getPricingDetails(planName: string, planPeriod: "month" | "year", region: keyof PriceJson, userPlans: UserPlan[], isAddon: boolean, months?: number) {
  try {
    const primaryPlan = userPlans.find((plan: any) => plan.isAddOn === false)
    
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName,
      }
    }) as Plan | null

    if (!plan) {
      throw new Error(`Plan ${planName} not found`)
    }

    if (isAddon) {
      const addonPlan = userPlans.find((plan: any) => plan.planName === planName)
      
      if (addonPlan && new Date(addonPlan.endDate) < new Date()) {
        const addonPricePerDay = plan?.monthlyPriceJson?.[region]! / 30
        const addonPrice = addonPricePerDay * (new Date(addonPlan.endDate).getDate() - new Date().getDate())

        return {
          planName: planName,
          period: planPeriod,
          isAddOn: true,
          endDate: new Date(addonPlan.endDate),
          price: addonPrice
        }
      }
      
      return {
        planName: planName,
        period: planPeriod,
        isAddOn: true,
        endDate: new Date(Date.now() + (months || 1) * 30 * 24 * 60 * 60 * 1000),
        price: plan?.monthlyPriceJson?.[region]! * (months || 1)
      }
    }

    if (!primaryPlan) {
      return {
        planName: planName,
        period: planPeriod,
        isAddOn: false,
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        price: planPeriod === 'month' ? plan?.monthlyPriceJson?.[region] : plan?.yearlyPriceJson?.[region]! * 12
      }
    }

    if (primaryPlan.period === 'month') {
      return {
        planName: planName,
        period: planPeriod,
        isAddOn: plan?.isAddOn,
        endDate: planPeriod === 'month' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        price: planPeriod === 'month' ? plan?.monthlyPriceJson?.[region] : plan?.yearlyPriceJson?.[region]! * 12
      }
    } else if (planPeriod === 'year') {
      const isPlanDownGrade = isPlanDowngrade(primaryPlan.name, planName)

      if (isPlanDownGrade) {
        console.log("isPlanDownGrade", isPlanDownGrade)
        return {
          planName: planName,
          period: planPeriod,
          isAddOn: plan?.isAddOn,
          endDate: primaryPlan.endDate,
          price: null
        }
      }

      const calculatedPrice = plan?.monthlyPriceJson?.[region]
      console.log("calculatedPrice", calculatedPrice)

      // if the user's primary plan is active and the plan is a upgrade then calculate the price for the remaining months of the year
      if (new Date(primaryPlan.endDate) > new Date()) {
        const remainingMonths = 12 - new Date(primaryPlan.endDate).getMonth()
        const price = calculatedPrice! * remainingMonths
        return {
          planName: planName,
          period: planPeriod,
          isAddOn: plan?.isAddOn,
          endDate: primaryPlan.endDate,
          price: price
        }
      }
      
      // calculate the price for the remaining months of the year
      const remainingMonths = 12 - new Date(primaryPlan.endDate).getMonth()
      const price = calculatedPrice! * remainingMonths

      return {
        planName: planName,
        period: planPeriod,
        isAddOn: plan?.isAddOn,
        endDate: primaryPlan.endDate,
        price: price
      }
    }

  } catch (error) {
    console.error(error)
    return null
  }
}