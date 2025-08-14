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
  if (primaryPlanName === 'BASIC' && (planName === 'PREMIUM' || planName ===  'ENTERPRISE')) {
    return false
  }
  if (primaryPlanName === 'PREMIUM' && ( planName === 'ENTERPRISE' )) {
    return false
  }

  return true
}

export async function getPricingDetails(planName: string, planPeriod: "month" | "year", region: keyof PriceJson, userPlans: UserPlan[]) {
  try {
    const primaryPlan = userPlans.find((plan: any) => plan.isAddon === false)
    
    const plan = await prisma.plan.findFirst({
      where: {
        name: planName,
      }
    }) as Plan | null

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
        return {
          planName: planName,
          period: planPeriod,
          isAddOn: plan?.isAddOn,
          endDate: primaryPlan.endDate,
          price: null
        }
      }

      const calculatedPrice = plan?.monthlyPriceJson?.[region]
      
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