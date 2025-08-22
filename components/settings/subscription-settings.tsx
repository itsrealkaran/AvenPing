"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Check, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import PaymentGatewayModal from "./payment-gateway-modal"
import DowngradeWarningModal from "./downgrade-warning-modal"
import AddonModal from "./addon-modal"
import { toast } from "sonner"
import { getPricingDetails } from "@/lib/get-pricing-details"
import { useUser } from "@/context/user-context"

interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

interface Plan {
  id: string
  name: string
  monthlyPriceJson: PriceJson
  yearlyPriceJson: PriceJson
  features: string[]
  isAddOn: boolean
  isCurrent?: boolean
  isUpgrade?: boolean
  isDowngrade?: boolean
  isActive?: boolean
  period: "month" | "year"
}

interface Addon {
  id: string
  name: string
  monthlyPriceJson: PriceJson
  yearlyPriceJson: PriceJson
  features: string[]
  isAddOn: boolean
  isActivated?: boolean
  isActive?: boolean
}

interface SubscriptionData {
  activePlan: Plan | null
  nextPlan: Plan | null
  downgradePlan: Plan | null
  allPlans: Plan[]
  addons: Addon[]
}

interface PlanDetailCardProps {
  plan: Plan
  currentPlanPeriod?: "month" | "year"
  period: "month" | "year"
  region: "US" | "IND" | "ASIA"
  onPeriodChange: (period: "month" | "year") => void
  onRegionChange: (region: "US" | "IND" | "ASIA") => void
  onUpgrade?: () => void
  isUpgrade?: boolean
}

const PlanDetailCard: React.FC<PlanDetailCardProps> = ({
  plan,
  currentPlanPeriod,
  period,
  region,
  onPeriodChange,
  onRegionChange,
  onUpgrade,
  isUpgrade = false
}) => {
  const getPrice = () => {
    const priceJson = period === "month" ? plan.monthlyPriceJson : plan.yearlyPriceJson
    return priceJson[region]
  }

  const getCurrencySymbol = () => {
    switch (region) {
      case "US": return "$"
      case "IND": return "₹"
      case "ASIA": return "$"
      default: return "$"
    }
  }

  const price = getPrice()
  const currencySymbol = getCurrencySymbol()

  const yearlyLocked = currentPlanPeriod === "year"

  return (
    <div className="relative">
      {/* Card Header */}
      <div className="mb-4">
        <span className="text-sm font-bold text-gray-900">
          {plan.isCurrent ? `Current Plan (${plan.period === "month" ? "Monthly" : "Yearly"})` : plan.isDowngrade ? "Downgrade Your Plan" : "Upgrade Your Plan"}
        </span>
      </div>

      {/* Main Card */}
      <div className={`rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200 ${
        plan.isCurrent 
          ? "bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-100 border border-cyan-200" 
          : plan.isDowngrade
          ? "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border-2 border-dashed border-orange-300"
          : "bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-200 border-2 border-dashed border-cyan-300"
      }`}>
        
        {/* Current Plan Badge */}
        {plan.isCurrent && (
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Plan Name */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
          
          {/* Region Selector */}
          <div className="flex items-center gap-2 mb-3">
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value as "US" | "IND" | "ASIA")}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="US">US</option>
              <option value="IND">IND</option>
              <option value="ASIA">ASIA</option>
            </select>
          </div>
          
          {/* Price and Billing Toggle */}
          <div className="flex flex-col items-left gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {price === 0 ? "Free" : `${currencySymbol}${price}/${period}`}
            </span>
            
            {price > 0 && (
              <div className="flex bg-white/50 rounded-lg p-1 w-fit">
                <button
                  onClick={() => onPeriodChange("year")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    period === "year" 
                      ? "bg-cyan-500 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  year
                </button>
                <button
                  disabled={plan.isCurrent && plan.period === "month" || yearlyLocked}
                  onClick={() => onPeriodChange("month")}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    period === "month" 
                      ? "bg-cyan-500 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  month
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-4">
          {plan.features.length > 0 ? (
            plan.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  plan.isDowngrade ? "bg-orange-500" : "bg-cyan-500"
                }`}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No features listed</div>
          )}
        </div>

        {/* View More Link */}
        <div className="mb-4">
          <button className={`text-sm font-medium transition-colors ${
            plan.isDowngrade 
              ? "text-orange-500 hover:text-orange-600" 
              : "text-cyan-500 hover:text-cyan-600"
          }`}>
            view more (6)
          </button>
        </div>

        {/* Action Button */}
        {isUpgrade && onUpgrade && (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Upgrade Now
          </Button>
        )}
        {plan.isDowngrade && onUpgrade && (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Downgrade Now
          </Button>
        )}
        {plan.isCurrent && (
          plan.period === "month" ? (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Change to Yearly
          </Button>
          ): plan.period === "year" ? (
            <p className="text-sm text-gray-500"> You are on a yearly plan</p>
          ) : null
        )}

        {/* Savings Text for Yearly Plans */}
        {period === "year" && price > 0 && (
          <div className="mt-3">
            <span className={`text-sm ${
              plan.isDowngrade ? "text-orange-600" : "text-gray-500"
            }`}>
              Save with yearly billing
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const AddOnsCard: React.FC = () => {
  return (
    <div className="relative">
      {/* Card Header */}
      <div className="mb-4">
        <span className="text-sm font-bold text-gray-900">Upgrade Your Plan</span>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-200 border-2 border-dashed border-cyan-300 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200">
        
        {/* Main Content */}
        <div className="text-center mb-6">
          <p className="text-gray-700">
            You Can Further Enhance
          </p>
          <p className="text-gray-700 mb-6">
            your Plans with <strong>Add-Ones</strong>
          </p>
        </div>
        <img src="/images/addons.png" alt="Add-Ons" className="w-full h-auto" />

        {/* Separator */}
        <div className="border-t border-cyan-300 mb-4"></div>

        {/* Browse Addons Button */}
        <Button 
          onClick={() => console.log("Browse addons")}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Browse Addons
        </Button>
      </div>
    </div>
  )
}



interface PriceJson {
  US: number
  IND: number
  ASIA: number
}

export default function SubscriptionSettings() {
  const [currentPlanPeriod, setCurrentPlanPeriod] = useState<"month" | "year">("year")
  const [upgradePlanPeriod, setUpgradePlanPeriod] = useState<"month" | "year">("year")
  const [downgradePlanPeriod, setDowngradePlanPeriod] = useState<"month" | "year">("year")
  const [allPlansPeriod, setAllPlansPeriod] = useState<"month" | "year">("year")
  const [region, setRegion] = useState<"US" | "IND" | "ASIA">("US")
  const [addonPeriods, setAddonPeriods] = useState<{ [key: string]: "month" | "year" }>({
    flows: "year",
    contacts: "year",
    mobileApp: "year"
  })

  // State for API data
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showPriceCalculationModal, setShowPriceCalculationModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string
    period: "month" | "year"
    price: number
  } | null>(null)
  const [priceCalculationDetails, setPriceCalculationDetails] = useState<any>(null)

  // State for showing/hiding all plans
  const [showAllPlans, setShowAllPlans] = useState(false)

  // State for downgrade warning modal
  const [showDowngradeWarning, setShowDowngradeWarning] = useState(false)

  // State for addon modal
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null)
  const [addonMonths, setAddonMonths] = useState(1)
  const [addonQuantity, setAddonQuantity] = useState(1)

  const { userInfo } = useUser()

  // Fetch subscription data from API
  const fetchSubscriptionData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription/get-next')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data')
      }
      
      const data = await response.json()
      setSubscriptionData(data)
      setCurrentPlanPeriod(data.activePlan?.period === "month" ? "year" : "month")

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching subscription data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  // Helper function to get plan price based on period and region
  const getPlanPrice = (plan: Plan | Addon, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    const priceJson = period === "month" ? plan.monthlyPriceJson : plan.yearlyPriceJson
    return priceJson[region]
  }

  // Helper function to get currency symbol based on region
  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    switch (region) {
      case "US": return "$"
      case "IND": return "₹"
      case "ASIA": return "$"
      default: return "$"
    }
  }

  // Get current plan from API data
  const getCurrentPlan = (): Plan | null => {
    if (!subscriptionData?.activePlan) {
      return null
    }

    const plan = subscriptionData.activePlan
    return {
      ...plan,
      isCurrent: true
    }
  }

  // Get upgrade plan from API data
  const getUpgradePlan = (): Plan | null => {
    if (!subscriptionData?.nextPlan) {
      return null
    }

    const plan = subscriptionData.nextPlan
    return {
      ...plan,
      isUpgrade: true
    }
  }

  // Get downgrade plan from API data
  const getDowngradePlan = (): Plan | null => {
    if (!subscriptionData?.downgradePlan) {
      return null
    }

    const plan = subscriptionData.downgradePlan
    return {
      ...plan,
      isDowngrade: true
    }
  }

  // Get addons from API data
  const getAddons = (): Addon[] => {
    if (!subscriptionData?.addons) {
      return []
    }

    return subscriptionData.addons.map(addon => ({
      ...addon,
      isActivated: addon.isActive,
      isActive: addon.isActive
    }))
  }

  // Get all plans from API data
  const getAllPlans = (): Plan[] => {
    if (!subscriptionData?.allPlans) {
      return []
    }

    return subscriptionData.allPlans.map(plan => {
      const isCurrent = plan.id === subscriptionData.activePlan?.id
      const isUpgrade = plan.id === subscriptionData.nextPlan?.id
      const isDowngrade = plan.id === subscriptionData.downgradePlan?.id
      
      return {
        ...plan,
        isCurrent,
        isUpgrade,
        isDowngrade
      }
    })
  }

  // Price calculation function using the same logic as get-pricing-details.ts
  const calculatePlanPrice = (planName: string, planPeriod: "month" | "year", region: keyof PriceJson, userPlans: any[], isAddon: boolean, months?: number) => {
    try {
      const primaryPlan = userPlans.find((plan: any) => plan.isAddOn === false)
      
      // Find the plan from allPlans instead of database
      const allPlans = getAllPlans()
      const plan = allPlans.find(p => p.name === planName)
      
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
        // Define plan hierarchy (higher index = higher tier)
        const planHierarchy = ['BASIC', 'PREMIUM', 'ENTERPRISE'];
        
        const currentIndex = planHierarchy.indexOf(primaryPlan.name);
        const targetIndex = planHierarchy.indexOf(planName);
        
        // If target plan is lower in hierarchy, it's a downgrade
        const isPlanDownGrade = targetIndex < currentIndex;

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

  const handleUpgrade = async (planName: string, period: "month" | "year") => {
    // Find the actual plan that was clicked from all plans
    const allPlans = getAllPlans()
    const selectedPlan = allPlans.find(plan => plan.name === planName)
    
    if (!selectedPlan) return

    console.log(planName, period, region, userInfo.plans, "userInfo.plans")
    
    // Calculate price using the same logic as get-pricing-details.ts
    const calculatedPrice = calculatePlanPrice(planName, period, region, userInfo.plans as any, false)
    console.log(calculatedPrice, "calculated price")

    setSelectedPlan({
      name: planName,
      period,
      price: calculatedPrice?.price || 0
    })
    
    // Set price calculation details for the modal
    setPriceCalculationDetails({
      planName,
      period,
      region,
      price: calculatedPrice,
      currentPlan: userInfo.plans?.find((plan: any) => plan.isAddOn === false),
      selectedPlan: selectedPlan
    })
    
    // Show price calculation modal first
    setShowPriceCalculationModal(true)
  }

  const handleDowngrade = async (planName: string, period: "month" | "year") => {
    // Show warning modal first
    setShowDowngradeWarning(true)
  }

  const handleDowngradeConfirm = async (planName: string, period: "month" | "year") => {
    try {
      // Call the downgrade API
      const response = await fetch('/api/subscription/downgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planName,
          planPeriod: period === "month" ? "MONTHLY" : "YEARLY"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Plan downgraded successfully
        toast.success(`Successfully downgraded to ${planName} plan`)
        
        // Refresh the subscription data
        fetchSubscriptionData()
        
        // Close any open modals
        setShowPaymentModal(false)
        setSelectedPlan(null)
        setShowDowngradeWarning(false)
      } else {
        throw new Error(data.message || 'Failed to downgrade plan')
      }
    } catch (error) {
      console.error('Downgrade error:', error)
      toast.error('Failed to downgrade plan. Please try again.')
    }
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPlan(null)
  }

  const handleProceedToPayment = () => {
    setShowPriceCalculationModal(false)
    setShowPaymentModal(true)
  }

  const handleClosePriceCalculationModal = () => {
    setShowPriceCalculationModal(false)
    setPriceCalculationDetails(null)
  }

  const handleGetAddon = (addonId: string) => {
    const addon = getAddons().find(a => a.id === addonId)
    if (addon) {
      setSelectedAddon(addon)
      setAddonMonths(1)
      setShowAddonModal(true)
    }
  }

  const handleCloseAddonModal = () => {
    setShowAddonModal(false)
    setSelectedAddon(null)
    setAddonMonths(1)
    setAddonQuantity(1)
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>Settings</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Subscription</span>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading subscription data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <span>Settings</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">Subscription</span>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Subscription</h3>
            <p className="text-xs text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentPlan = getCurrentPlan()
  const upgradePlan = getUpgradePlan()
  const addons = getAddons()

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Subscription</span>
      </div>

      {/* AvenPing Subscriptions Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AvenPing Subscriptions</h1>
          <p className="text-gray-600">Browse your Active Plans, Upgrades, Addons and other features.</p>
        </div>

        {/* Plan Cards */}
        <div className={`grid gap-8 max-w-7xl mx-auto ${
          getDowngradePlan() ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
        }`}>

          {/* Downgrade Plan Card or Add-ons Card */}
          {getDowngradePlan() ? (
            <PlanDetailCard
              plan={getDowngradePlan()!}
              currentPlanPeriod={currentPlan?.period}
              period={downgradePlanPeriod}
              region={region}
              onPeriodChange={setDowngradePlanPeriod}
              onRegionChange={setRegion}
              onUpgrade={() => handleDowngrade(getDowngradePlan()!.name, downgradePlanPeriod)}
              isUpgrade={false}
            />
          ) : null}

          {/* Current Plan Card */}
          {currentPlan ? (
            <PlanDetailCard
              plan={currentPlan}
              currentPlanPeriod={currentPlan?.period}
              period={currentPlanPeriod}
              region={region}
              onPeriodChange={setCurrentPlanPeriod}
              onUpgrade={() => handleUpgrade(currentPlan.name, currentPlan.period === "month" ? "year" : "month")}
              onRegionChange={setRegion}
            />
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Plan</h3>
                <p className="text-gray-600 mb-4">You don't have an active subscription plan.</p>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          )}

          {/* Upgrade Plan Card */}
          {upgradePlan && (
            <PlanDetailCard
              plan={upgradePlan}
              currentPlanPeriod={currentPlan?.period}
              period={upgradePlanPeriod}
              region={region}
              onPeriodChange={setUpgradePlanPeriod}
              onRegionChange={setRegion}
              onUpgrade={() => handleUpgrade(upgradePlan.name, upgradePlanPeriod)}
              isUpgrade={true}
            />
          )}
        </div>

        {/* All Plans Section */}
        {showAllPlans && getAllPlans().length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">All Available Plans</h2>
              <p className="text-gray-600">Compare all available subscription plans and choose the one that fits your needs.</p>
            </div>

            {/* Period Selector for All Plans */}
            <div className="flex justify-center">
              <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                <button
                  disabled={subscriptionData?.activePlan?.period === "month"}
                  onClick={() => setAllPlansPeriod("month")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    allPlansPeriod === "month" 
                      ? "bg-cyan-500 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  disabled={subscriptionData?.activePlan?.period === "year"}
                  onClick={() => setAllPlansPeriod("year")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    allPlansPeriod === "year" 
                      ? "bg-cyan-500 text-white" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* All Plans Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {getAllPlans().map((plan) => {
                const isCurrent = plan.isCurrent
                const isUpgrade = plan.isUpgrade
                const isDowngrade = plan.isDowngrade
                
                return (
                  <div key={plan.id} className={`rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200 ${
                    isCurrent 
                      ? "bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-100 border border-cyan-200" 
                      : isDowngrade
                      ? "bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 border-2 border-dashed border-orange-300"
                      : isUpgrade
                      ? "bg-gradient-to-br from-cyan-50 via-cyan-100 to-cyan-200 border-2 border-dashed border-cyan-300"
                      : "bg-white border border-gray-200"
                  }`}>
                    
                    {/* Plan Status Badge */}
                    {isCurrent && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-500">Current {} Plan</span>
                      </div>
                    )}
                    {isUpgrade && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-cyan-100 text-cyan-600 text-xs font-medium px-2 py-1 rounded-full">
                          Upgrade
                        </span>
                      </div>
                    )}
                    {isDowngrade && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
                          Downgrade
                        </span>
                      </div>
                    )}

                    {/* Plan Name */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{plan.name}</h3>
                      
                      {/* Price Display */}
                      <div className="mb-4">
                        <div className="text-center">
                          <span className="text-2xl font-bold text-gray-900">
                            {getPlanPrice(plan, allPlansPeriod, region) === 0 ? "Free" : `${getCurrencySymbol(region)}${getPlanPrice(plan, allPlansPeriod, region)}/${allPlansPeriod}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3 mb-4">
                      {plan.features.length > 0 ? (
                        plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isDowngrade ? "bg-orange-500" : "bg-cyan-500"
                            }`}>
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">No features listed</div>
                      )}
                      
                      {/* Show more features indicator */}
                      {plan.features.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">+{plan.features.length - 3} more features</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    {isCurrent ? (
                      <button className="w-full bg-gray-100 text-gray-600 font-medium py-3 rounded-lg cursor-default">
                        Current Plan
                      </button>
                    ) : isUpgrade ? (
                      <Button 
                        onClick={() => handleUpgrade(plan.name, allPlansPeriod)}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Upgrade Now
                      </Button>
                    ) : isDowngrade ? (
                      <Button 
                        onClick={() => handleDowngrade(plan.name, allPlansPeriod)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Downgrade Now
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleUpgrade(plan.name, allPlansPeriod)}
                        className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Get Started
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Browse More Plans Link */}
        <div className="text-center">
          <button 
            onClick={() => setShowAllPlans(!showAllPlans)}
            className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            {showAllPlans ? "Hide Plans" : "Browse More Plans"} 
            <ArrowRight className={`w-4 h-4 transition-transform ${showAllPlans ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Add-Ons Section */}
      {addons.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Add-Ons</h2>
            <p className="text-gray-600">Browse the Add Ons Market Place and Modify your existing Plan.</p>
          </div>

          {/* Addon Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {addons.map((addon) => {
              const price = getPlanPrice(addon, addonPeriods[addon.id] || "month", region)
              const currencySymbol = region === "US" ? "$" : region === "IND" ? "₹" : "$"
              
              return (
                <div key={addon.id} className="bg-white rounded-xl border border-gray-200 p-6 relative shadow-sm hover:shadow-md transition-shadow">
                  {!addon.isActivated && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-cyan-100 text-cyan-600 text-xs font-medium px-2 py-1 rounded-full">
                        Addon
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{addon.name}</h3>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xl font-bold text-gray-900">{currencySymbol}{price}/{addonPeriods[addon.id] || "month"}</span>
                    </div>
                  </div>

                  <div className="text-center">
                    {addon.isActivated ? (
                      <Button 
                        onClick={() => handleGetAddon(addon.id)}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Get More
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleGetAddon(addon.id)}
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 rounded-lg transition-colors"
                      >
                        Get This Addone
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Price Calculation Modal */}
      {showPriceCalculationModal && priceCalculationDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Price Calculation</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {priceCalculationDetails.planName} Plan - {getCurrencySymbol(priceCalculationDetails.region)}
                </p>
              </div>
              <button
                onClick={handleClosePriceCalculationModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 space-y-4">
              {/* Current Plan */}
              {priceCalculationDetails.currentPlan && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Plan</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {priceCalculationDetails.currentPlan.name} ({priceCalculationDetails.currentPlan.period})
                    </span>
                    <span className="text-sm text-gray-500">
                      Expires: {new Date(priceCalculationDetails.currentPlan.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              {/* New Plan */}
              <div className="bg-blue-50 rounded-lg p-3">
                <h3 className="text-sm font-medium text-blue-700 mb-2">New Plan</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-600">
                    {priceCalculationDetails.planName} ({priceCalculationDetails.period})
                  </span>
                  <span className="text-sm text-blue-500">
                    {priceCalculationDetails.price?.endDate && 
                      `Until: ${new Date(priceCalculationDetails.price.endDate).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Plan Price</span>
                  <span className="text-sm text-gray-900">
                    {getCurrencySymbol(priceCalculationDetails.region)}
                    {priceCalculationDetails.selectedPlan?.monthlyPriceJson?.[priceCalculationDetails.region] || 0}
                    /month
                  </span>
                </div>
                
                {priceCalculationDetails.period === "year" && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Yearly Total</span>
                    <span className="text-sm text-gray-900">
                      {getCurrencySymbol(priceCalculationDetails.region)}
                      {(priceCalculationDetails.selectedPlan?.monthlyPriceJson?.[priceCalculationDetails.region] || 0) * 12}
                    </span>
                  </div>
                )}

                {/* Pro-rated calculation if applicable */}
                {priceCalculationDetails.price?.price !== null && priceCalculationDetails.currentPlan && (
                  <div className="bg-yellow-50 rounded-lg p-3 mt-3">
                    <h4 className="text-sm font-medium text-yellow-700 mb-1">Pro-rated Calculation</h4>
                    <p className="text-xs text-yellow-600">
                      {priceCalculationDetails.period === "year" && 
                        `Based on remaining months until ${new Date(priceCalculationDetails.currentPlan.endDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                )}

                {/* Final Price */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg font-bold text-green-600">
                      {getCurrencySymbol(priceCalculationDetails.region)}
                      {priceCalculationDetails.price?.price || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClosePriceCalculationModal}
                  className="flex-1 text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProceedToPayment}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {selectedPlan && (
        <PaymentGatewayModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          planName={selectedPlan.name}
          planPeriod={selectedPlan.period}
          region={region}
          price={selectedPlan.price}
          currency={getCurrencySymbol(region)}
        />
      )}

      {/* Downgrade Warning Modal */}
      {showDowngradeWarning && (
        <DowngradeWarningModal
          isOpen={showDowngradeWarning}
          onClose={() => setShowDowngradeWarning(false)}
          onConfirm={() => {
            handleDowngradeConfirm(getDowngradePlan()!.name, downgradePlanPeriod);
            setShowDowngradeWarning(false);
          }}
          planName={getDowngradePlan()!.name}
          currentPlanName={getCurrentPlan()?.name || "Current Plan"}
          period={downgradePlanPeriod}
        />
      )}

      {/* Addon Modal */}
      {selectedAddon && (
        <AddonModal
          isOpen={showAddonModal}
          onClose={handleCloseAddonModal}
          addon={selectedAddon}
          months={addonMonths}
          onMonthsChange={setAddonMonths}
          region={region}
          quantity={addonQuantity}
          onQuantityChange={setAddonQuantity}
        />
      )}
    </div>
  )
} 