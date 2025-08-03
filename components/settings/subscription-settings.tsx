"use client"

import React, { useState } from "react"
import { ChevronRight, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Plan {
  id: string
  name: string
  price: number
  period: "month" | "year"
  features: string[]
  isCurrent?: boolean
  isUpgrade?: boolean
}

interface Addon {
  id: string
  name: string
  price: number
  period: "month" | "year"
  isActivated?: boolean
}

interface PlanDetailCardProps {
  plan: Plan
  period: "month" | "year"
  onPeriodChange: (period: "month" | "year") => void
  onUpgrade?: () => void
  isUpgrade?: boolean
}

const PlanDetailCard: React.FC<PlanDetailCardProps> = ({
  plan,
  period,
  onPeriodChange,
  onUpgrade,
  isUpgrade = false
}) => {
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
          
          {/* Price and Billing Toggle */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {plan.price === 0 ? "Free" : `$${plan.price}/${period}`}
            </span>
            
            {plan.price > 0 && (
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
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
            </div>
          ))}
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
        {period === "year" && plan.price > 0 && (
          <div className="mt-3">
            <span className="text-sm text-gray-500">Save $40.00</span>
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
  const [addonPeriods, setAddonPeriods] = useState<{ [key: string]: "month" | "year" }>({
    flows: "year",
    contacts: "year",
    mobileApp: "year"
  })

  // Debug state for testing different plans
  const [debugCurrentPlan, setDebugCurrentPlan] = useState<"starter" | "basic" | "premium" | "enterprise">("basic")

  const starterPlan: Plan = {
    id: "starter",
    name: "Starter Plan",
    price: 0,
    period: currentPlanPeriod,
    features: [
      "Service Conversations",
      "QR Generator", 
      "Whatsapp Button Generator",
      "Profile Manger",
      "Contacts - 800"
    ],
    isCurrent: true
  }

  const basicPlan: Plan = {
    id: "basic",
    name: "Basic Plan",
    price: 29,
    period: currentPlanPeriod,
    features: [
      "Service Conversations - unlimited",
      "QR Generator", 
      "Whatsapp Button Generator",
      "Profile Manger",
      "Contacts - 1500"
    ],
    isCurrent: true
  }

  const premiumPlan: Plan = {
    id: "premium",
    name: "Premium Plan",
    price: 59,
    period: currentPlanPeriod,
    features: [
      "Everything from Basic Plan plus",
      "WhatsApp Green Tick Application",
      "Catalogue",
      "Campaigns - unlimited"
    ],
    isCurrent: true
  }

  const enterprisePlan: Plan = {
    id: "enterprise",
    name: "Enterprise Plan",
    price: 79,
    period: currentPlanPeriod,
    features: [
      "Everything from Premium Plan plus",
      "AI Chat Bot",
      "Campaign Analytics",
      "Mobile App"
    ],
    isCurrent: true
  }

  // Get current plan based on debug selection
  const getCurrentPlan = (): Plan => {
    switch (debugCurrentPlan) {
      case "starter":
        return { ...starterPlan, period: currentPlanPeriod }
      case "basic":
        return { ...basicPlan, period: currentPlanPeriod }
      case "premium":
        return { ...premiumPlan, period: currentPlanPeriod }
      case "enterprise":
        return { ...enterprisePlan, period: currentPlanPeriod }
      default:
        return { ...basicPlan, period: currentPlanPeriod }
    }
  }

  // Get upgrade plan based on current plan
  const getUpgradePlan = (): Plan => {
    switch (debugCurrentPlan) {
      case "starter":
        return { ...basicPlan, isUpgrade: true, period: upgradePlanPeriod }
      case "basic":
        return { ...premiumPlan, isUpgrade: true, period: upgradePlanPeriod }
      case "premium":
        return { ...enterprisePlan, isUpgrade: true, period: upgradePlanPeriod }
      case "enterprise":
        return { 
          id: "custom",
          name: "Custom Plan",
          price: 99,
          period: upgradePlanPeriod,
          features: [
            "Everything from Enterprise Plan plus",
            "Custom Integrations",
            "Priority Support",
            "Dedicated Account Manager"
          ],
          isUpgrade: true
        }
      default:
        return { ...premiumPlan, isUpgrade: true, period: upgradePlanPeriod }
    }
  }

  const addons: Addon[] = [
    {
      id: "flows",
      name: "Flows (1)",
      price: 5,
      period: addonPeriods.flows,
      isActivated: true
    },
    {
      id: "contacts", 
      name: "Contact(1000)",
      price: 7,
      period: addonPeriods.contacts
    },
    {
      id: "mobileApp",
      name: "Mobile App",
      price: 19,
      period: addonPeriods.mobileApp
    }
  ]

  const handleUpgrade = () => {
    console.log("Upgrade to next plan")
  }

  const handleGetAddon = (addonId: string) => {
    console.log(`Get addon: ${addonId}`)
  }

  const handleBrowseMorePlans = () => {
    console.log("Browse more plans")
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Subscription</span>
      </div>

      {/* Debug Section - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-yellow-800 mb-1">Debug Mode</h3>
              <p className="text-xs text-yellow-700">Change current plan to test different card states</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-yellow-800">Current Plan:</label>
              <select
                value={debugCurrentPlan}
                onChange={(e) => setDebugCurrentPlan(e.target.value as any)}
                className="text-xs border border-yellow-300 rounded px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="starter">Starter (Free)</option>
                <option value="basic">Basic ($29)</option>
                <option value="premium">Premium ($59)</option>
                <option value="enterprise">Enterprise ($79)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* AvenPing Subscriptions Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AvenPing Subscriptions</h1>
          <p className="text-gray-600">Browse your Active Plans, Upgrades, Addons and other features.</p>
        </div>

        {/* Plan Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Current Plan Card */}
          <PlanDetailCard
            plan={getCurrentPlan()}
            period={currentPlanPeriod}
            onPeriodChange={setCurrentPlanPeriod}
          />

          {/* Upgrade Plan Card or Add-ons Card */}
          {debugCurrentPlan === "enterprise" ? (
            <AddOnsCard />
          ) : (
            <PlanDetailCard
              plan={getUpgradePlan()}
              period={upgradePlanPeriod}
              onPeriodChange={setUpgradePlanPeriod}
              onUpgrade={handleUpgrade}
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
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Add-Ons</h2>
          <p className="text-gray-600">Browse the Add Ons Market Place and Modify your existing Plan.</p>
        </div>

        {/* Addon Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {addons.map((addon) => (
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
                  <span className="text-xl font-bold text-gray-900">${addon.price}/{addon.period}</span>
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
          ))}
        </div>
      </div>
    </div>
  )
} 