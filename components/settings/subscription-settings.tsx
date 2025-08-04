"use client"

import React, { useState, useEffect } from "react"
import { ChevronRight, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import PaymentGatewayModal from "./payment-gateway-modal"

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
  isActive?: boolean
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
  addons: Addon[]
}

interface PlanDetailCardProps {
  plan: Plan
  period: "month" | "year"
  region: "US" | "IND" | "ASIA"
  onPeriodChange: (period: "month" | "year") => void
  onRegionChange: (region: "US" | "IND" | "ASIA") => void
  onUpgrade?: () => void
  isUpgrade?: boolean
}

const PlanDetailCard: React.FC<PlanDetailCardProps> = ({
  plan,
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

  return (
    <div className="relative">
      {/* Card Header */}
      <div className="mb-4">
        <span className="text-sm font-bold text-gray-900">
          {plan.isCurrent ? "Current Plan" : "Upgrade Your Plan"}
        </span>
      </div>

      {/* Main Card */}
      <div className={`rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200 ${
        plan.isCurrent 
          ? "bg-gradient-to-br from-cyan-50 via-cyan-50 to-cyan-100 border border-cyan-200" 
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
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {price === 0 ? "Free" : `${currencySymbol}${price}/${period}`}
            </span>
            
            {price > 0 && (
              <div className="flex bg-white/50 rounded-lg p-1">
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
                <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
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
          <button className="text-cyan-500 text-sm font-medium hover:text-cyan-600 transition-colors">
            view more (6)
          </button>
        </div>

        {/* Upgrade Button */}
        {isUpgrade && onUpgrade && (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Upgrade Now
          </Button>
        )}

        {/* Savings Text for Yearly Plans */}
        {period === "year" && price > 0 && (
          <div className="mt-3">
            <span className="text-sm text-gray-500">Save with yearly billing</span>
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

export default function SubscriptionSettings() {
  const [currentPlanPeriod, setCurrentPlanPeriod] = useState<"month" | "year">("year")
  const [upgradePlanPeriod, setUpgradePlanPeriod] = useState<"month" | "year">("month")
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
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string
    period: "month" | "year"
    price: number
  } | null>(null)

  // Fetch subscription data from API
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/subscription/get-next')
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription data')
        }
        
        const data = await response.json()
        setSubscriptionData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching subscription data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [])

  // Helper function to get plan price based on period and region
  const getPlanPrice = (plan: Plan | Addon, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    const priceJson = period === "month" ? plan.monthlyPriceJson : plan.yearlyPriceJson
    return priceJson[region]
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

  const handleUpgrade = (planName: string, period: "month" | "year") => {
    const upgradePlan = getUpgradePlan()
    if (!upgradePlan) return

    const price = getPlanPrice(upgradePlan, period, region)
    const currency = region === "US" ? "$" : region === "IND" ? "₹" : "$"

    setSelectedPlan({
      name: planName,
      period,
      price
    })
    setShowPaymentModal(true)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPlan(null)
  }

  const handleGetAddon = (addonId: string) => {
    console.log(`Get addon: ${addonId}`)
  }

  const handleBrowseMorePlans = () => {
    console.log("Browse more plans")
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
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Current Plan Card */}
          {currentPlan ? (
            <PlanDetailCard
              plan={currentPlan}
              period={currentPlanPeriod}
              region={region}
              onPeriodChange={setCurrentPlanPeriod}
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

          {/* Upgrade Plan Card or Add-ons Card */}
          {!upgradePlan ? (
            <AddOnsCard />
          ) : (
            <PlanDetailCard
              plan={upgradePlan}
              period={upgradePlanPeriod}
              region={region}
              onPeriodChange={setUpgradePlanPeriod}
              onRegionChange={setRegion}
              onUpgrade={() => handleUpgrade(upgradePlan.name, upgradePlanPeriod)}
              isUpgrade={true}
            />
          )}
        </div>

        {/* Browse More Plans Link */}
        <div className="text-center">
          <button 
            onClick={handleBrowseMorePlans}
            className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            Browse More Plans <ArrowRight className="w-4 h-4" />
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
                      <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setAddonPeriods(prev => ({ ...prev, [addon.id]: "year" }))}
                          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                            addonPeriods[addon.id] === "year" 
                              ? "bg-cyan-500 text-white" 
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          year
                        </button>
                        <button
                          onClick={() => setAddonPeriods(prev => ({ ...prev, [addon.id]: "month" }))}
                          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                            addonPeriods[addon.id] === "month" 
                              ? "bg-cyan-500 text-white" 
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          month
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    {addon.isActivated ? (
                      <button className="w-full bg-gray-100 text-gray-600 font-medium py-2 rounded-lg cursor-default">
                        Already Activated
                      </button>
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

      {/* Payment Gateway Modal */}
      {selectedPlan && (
        <PaymentGatewayModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          planName={selectedPlan.name}
          planPeriod={selectedPlan.period}
          region={region}
          price={selectedPlan.price}
          currency={region === "US" ? "$" : region === "IND" ? "₹" : "$"}
        />
      )}
    </div>
  )
} 