"use client"

import { useState } from "react"
import { Check, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/landing/navbar"

const plans = [
  {
    name: "Starter",
    price: "$29",
    yearlyPrice: "$290",
    period: "per month",
    description: "Perfect for small businesses getting started",
    features: [
      { name: "Up to 1,000 messages/month", included: true },
      { name: "Basic automation", included: true },
      { name: "Contact management", included: true },
      { name: "Email support", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Team collaboration", included: false },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    yearlyPrice: "$790",
    period: "per month",
    description: "Ideal for growing businesses",
    features: [
      { name: "Up to 10,000 messages/month", included: true },
      { name: "Advanced automation", included: true },
      { name: "Contact management", included: true },
      { name: "Priority support", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Team collaboration", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: false },
      { name: "White-label options", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    yearlyPrice: "$1990",
    period: "per month",
    description: "For large organizations with complex needs",
    features: [
      { name: "Unlimited messages", included: true },
      { name: "Advanced AI features", included: true },
      { name: "Multi-team management", included: true },
      { name: "Dedicated support", included: true },
      { name: "WhatsApp integration", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Team collaboration", included: true },
      { name: "API access", included: true },
      { name: "Custom integrations", included: true },
      { name: "White-label options", included: true },
    ],
    popular: false,
  },
]

const allFeatures = [
  "Up to 1,000 messages/month",
  "Up to 10,000 messages/month",
  "Unlimited messages",
  "Basic automation",
  "Advanced automation",
  "Advanced AI features",
  "Contact management",
  "Multi-team management",
  "Email support",
  "Priority support",
  "Dedicated support",
  "WhatsApp integration",
  "Advanced analytics",
  "Team collaboration",
  "API access",
  "Custom integrations",
  "White-label options",
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({})

  const toggleExpanded = (cardIndex: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Simple, transparent pricing that grows with you. Start free and upgrade as your business expands.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isYearly ? "bg-cyan-500" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-500"}`}>Yearly</span>
            {isYearly && (
              <span className="bg-cyan-100 text-cyan-600 px-2 py-1 rounded-md text-xs font-medium">Save 20%</span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const initialFeatures = plan.features.slice(0, 5)
              const additionalFeatures = plan.features.slice(5)
              const hasMoreFeatures = additionalFeatures.length > 0
              const isExpanded = expandedCards[index]

              return (
                <div
                  key={plan.name}
                  className={`bg-white rounded-3xl p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
                    plan.popular ? "border-cyan-500 relative" : "border-gray-200 hover:border-cyan-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        {isYearly ? plan.yearlyPrice : plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">{isYearly ? "/year" : plan.period}</span>
                    </div>
                    {isYearly && <p className="text-sm text-cyan-600 font-medium">2 months free!</p>}
                  </div>

                  <div className="flex-grow mb-8">
                    <ul className="space-y-4">
                      {initialFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check size={20} className="text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature.name}</span>
                        </li>
                      ))}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="-mt-4 space-y-4 pt-4">
                          {additionalFeatures.map((feature, featureIndex) => (
                            <li key={`additional-${featureIndex}`} className="flex items-start">
                              <Check size={20} className="text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature.name}</span>
                            </li>
                          ))}
                        </div>
                      </div>
                    </ul>
                    {hasMoreFeatures && (
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="flex items-center justify-center w-full text-cyan-600 hover:text-cyan-700 font-medium py-4 transition-colors duration-200"
                      >
                        <span className="mr-1 text-sm">
                          {isExpanded ? "View Less" : `View More (${additionalFeatures.length})`}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 mt-auto">
                    <Button
                      className={`w-full h-12 text-lg rounded-full ${
                        plan.popular
                          ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                      }`}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Compare All Features</h2>
              <p className="text-gray-600 text-sm">See exactly what's included in each plan</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900 text-sm">Features</th>
                    {plans.map((plan) => (
                      <th key={plan.name} className="text-center p-4 min-w-[140px]">
                        <div className="font-medium text-gray-900 text-sm">{plan.name}</div>
                        <div className="text-xl font-bold text-gray-900 mt-1">
                          {isYearly ? plan.yearlyPrice : plan.price}
                        </div>
                        <div className="text-xs text-gray-600">{isYearly ? "/year" : plan.period}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, index) => (
                    <tr key={feature} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-4 text-sm text-gray-900">{feature}</td>
                      {plans.map((plan) => {
                        const planFeature = plan.features.find((f) => f.name === feature)
                        return (
                          <td key={plan.name} className="p-4 text-center">
                            {planFeature?.included ? (
                              <Check size={18} className="text-cyan-500 mx-auto" />
                            ) : (
                              <X size={18} className="text-gray-300 mx-auto" />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 py-8">
            <p className="text-gray-600 mb-4 text-sm">Need a custom solution? We're here to help.</p>
            <Button variant="outline" className="px-6 bg-transparent">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
