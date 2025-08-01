"use client"

import { useState } from "react"
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Headphones,
  BarChart3,
  Settings,
  Database,
  MessageCircle,
  Users,
  Bot,
  Zap,
  Shield,
  QrCode,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { WobbleCard } from "@/components/ui/wobble-card"
import InfiniteMovingCardsDemo from "@/components/infinite-moving-cards-demo"
import Navbar from "@/components/landing/navbar"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Footer } from "@/components/landing/footer"
import Tag from "@/components/landing/ui/tag"

const plans = [
  {
    name: "Basic",
    price: "$35",
    yearlyPrice: "$29",
    period: "per month",
    yearlyNote: "Save $72 yearly",
    description: "Perfect for small businesses getting started",
    features: [
      { name: "Service Conversations - Unlimited", included: true },
      { name: "QR Generator", included: true },
      { name: "WhatsApp Button Generator", included: true },
      { name: "Profile Manager", included: true },
      { name: "Contacts - 1,500", included: true },
      { name: "Labels - 10", included: true },
      { name: "Attributes - 3", included: true },
      { name: "Templates - Unlimited", included: true },
      { name: "Phone Numbers - Unlimited", included: true },
      { name: "Campaigns - 2,500 recipients", included: true },
      { name: "WhatsApp Green Tick Application", included: false },
      { name: "Catalogue", included: false },
      { name: "Flow Builder", included: false },
      { name: "Analytics", included: false },
      { name: "AI Chat Bot", included: false },
      { name: "Campaign Analytics", included: false },
      { name: "Scheduled Campaigns", included: false },
      { name: "Priority Support", included: false },
      { name: "Mobile App", included: false },
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "$71",
    yearlyPrice: "$59",
    period: "per month",
    yearlyNote: "Save $144 yearly",
    description: "Ideal for growing businesses and small teams",
    features: [
      { name: "Service Conversations - Unlimited", included: true },
      { name: "QR Generator", included: true },
      { name: "WhatsApp Button Generator", included: true },
      { name: "Profile Manager", included: true },
      { name: "Contacts - 3,000", included: true },
      { name: "Labels - 10", included: true },
      { name: "Attributes - 5", included: true },
      { name: "Templates - Unlimited", included: true },
      { name: "Phone Numbers - Unlimited", included: true },
      { name: "Campaigns - Unlimited", included: true },
      { name: "WhatsApp Green Tick Application", included: true },
      { name: "Catalogue", included: true },
      { name: "Flow Builder - 3 Flows", included: true },
      { name: "Analytics", included: true },
      { name: "AI Chat Bot", included: false },
      { name: "Campaign Analytics", included: false },
      { name: "Scheduled Campaigns", included: false },
      { name: "Priority Support", included: false },
      { name: "Mobile App", included: false },
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$95",
    yearlyPrice: "$79",
    period: "per month",
    yearlyNote: "Save $192 yearly",
    description: "For large organizations with complex needs",
    features: [
      { name: "Service Conversations - Unlimited", included: true },
      { name: "QR Generator", included: true },
      { name: "WhatsApp Button Generator", included: true },
      { name: "Profile Manager", included: true },
      { name: "Contacts - 6,000", included: true },
      { name: "Labels - 10", included: true },
      { name: "Attributes - 10", included: true },
      { name: "Templates - Unlimited", included: true },
      { name: "Phone Numbers - Unlimited", included: true },
      { name: "Campaigns - Unlimited", included: true },
      { name: "WhatsApp Green Tick Application", included: true },
      { name: "Catalogue", included: true },
      { name: "Flow Builder - 5 Flows", included: true },
      { name: "Analytics", included: true },
      { name: "AI Chat Bot", included: true },
      { name: "Campaign Analytics", included: true },
      { name: "Scheduled Campaigns", included: true },
      { name: "Priority Support", included: true },
      { name: "Mobile App", included: true },
    ],
    popular: false,
  },
]

const allFeatures = [
  "Service Conversations - Unlimited",
  "QR Generator",
  "WhatsApp Button Generator",
  "Profile Manager",
  "Contacts - 1,500",
  "Contacts - 3,000",
  "Contacts - 6,000",
  "Labels - 10",
  "Attributes - 3",
  "Attributes - 5",
  "Attributes - 10",
  "Templates - Unlimited",
  "Phone Numbers - Unlimited",
  "Campaigns - 2,500 recipients",
  "Campaigns - Unlimited",
  "WhatsApp Green Tick Application",
  "Catalogue",
  "Flow Builder - 3 Flows",
  "Flow Builder - 5 Flows",
  "Analytics",
  "AI Chat Bot",
  "Campaign Analytics",
  "Scheduled Campaigns",
  "Priority Support",
  "Mobile App",
]

const addOns = [
  {
    title: "Additional Flow",
    description:
      "Add one more flow to your flow builder for creating advanced customer journeys and automated sequences.",
    link: "More Detail",
    icon: <Settings size={24} className="text-cyan-600" />,
    price: "$5/month",
  },
  {
    title: "Extra Contacts (1,000)",
    description: "Expand your contact database with 1,000 additional contacts to manage more customers effectively.",
    link: "More Detail",
    icon: <Users size={24} className="text-cyan-600" />,
    price: "$7/month",
  },
  {
    title: "Mobile App Access",
    description: "Get full access to our mobile application for managing your WhatsApp business on the go.",
    link: "More Detail",
    icon: <Smartphone size={24} className="text-cyan-600" />,
    price: "$19/month",
  },
  {
    title: "Auto-Sync Feature",
    description:
      "Automatically sync incoming recipients to edit contacts from chat screen without manual intervention.",
    link: "More Detail",
    icon: <Database size={24} className="text-cyan-600" />,
    price: "Included in Premium+",
  },
  {
    title: "Priority Support",
    description: "Get 24/7 priority access to our support team with faster response times and dedicated assistance.",
    link: "More Detail",
    icon: <Headphones size={24} className="text-cyan-600" />,
    price: "Enterprise Only",
  },
  {
    title: "Advanced Analytics",
    description: "Deep dive into your campaign performance with detailed analytics, reports, and customer insights.",
    link: "More Detail",
    icon: <BarChart3 size={24} className="text-cyan-600" />,
    price: "Premium+",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({})
  const [email, setEmail] = useState("")

  const toggleExpanded = (cardIndex: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 via-purple-100 to-white">
      <Navbar />

      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-sm font-medium">
                <Tag>Pricing Plans</Tag>
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-8 leading-tight">
              Select an AvenPing Plan That Matches Your <br />
              <span className="text-cyan-600">Goals!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Take control of your WhatsApp business from start to finish. You'll never miss a step along the way.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"}`}>
              Monthly billing
            </span>
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
            <span className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-500"}`}>
              Annual billing
            </span>
            {isYearly && (
              <span className="bg-cyan-100 text-cyan-600 px-2 py-1 rounded-md text-xs font-medium">
                Save up to $192/year
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => {
              const initialFeatures = plan.features.slice(0, 8)
              const additionalFeatures = plan.features.slice(8)
              const hasMoreFeatures = additionalFeatures.length > 0
              const isExpanded = expandedCards[index]

              return (
                <div
                  key={plan.name}
                  className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl flex flex-col h-full ${
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
                      <span className="text-gray-600 ml-2">{plan.period}</span>
                    </div>
                    {isYearly && <p className="text-sm text-cyan-600 font-medium">{plan.yearlyNote}</p>}
                  </div>
                  <div className="flex-grow mb-8">
                    <ul className="space-y-4">
                      {initialFeatures.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          {feature.included ? (
                            <Check size={20} className="text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X size={20} className="text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                            {feature.name}
                          </span>
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
                              {feature.included ? (
                                <Check size={20} className="text-cyan-500 mr-3 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X size={20} className="text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                              )}
                              <span className={`text-sm ${feature.included ? "text-gray-700" : "text-gray-400"}`}>
                                {feature.name}
                              </span>
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
          <div className="mb-16 mt-20">
          <div className="text-center mb-8 ">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhance Your Plan with <span className="text-cyan-600">Add-Ons</span> </h2> 
              <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                Customize your AvenPing experience with these powerful add-ons designed to scale with your business
                needs.
              </p>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-sm font-medium">
                6 Add-ons Available
              </span>
            </div>
            <HoverEffect items={addOns} />
          </div>
         

          {/* Enhanced Experience Section with Wobble Cards - Consistent Colors */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Experience the Power of <span className="text-cyan-600">AvenPing</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover how AvenPing transforms your WhatsApp business communications with cutting-edge features and
                seamless integrations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
              <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-gradient-to-br from-cyan-500 to-cyan-600 min-h-[500px] lg:min-h-[300px]">
                <div className="max-w-xs">
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    AvenPing powers your entire WhatsApp business
                  </h2>
                  <p className="mt-4 text-left text-base/6 text-neutral-200">
                    With over 10,000+ active business users, AvenPing is the most trusted WhatsApp business platform for
                    modern companies.
                  </p>
                </div>
                <img
          src="/whatsapp-dashboard.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
              </WobbleCard>

              <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-gradient-to-br from-cyan-400 to-cyan-500">
                <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  Smart automation, seamless experience.
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  Automate responses, manage contacts, and track analytics all in one powerful platform.
                </p>
                <div className="absolute -right-4 -bottom-4">
                  <Bot size={80} className="text-white/30" />
                </div>
              </WobbleCard>

              <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-gradient-to-br from-cyan-600 to-blue-600 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                <div className="max-w-sm">
                  <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Join thousands of businesses already using AvenPing for WhatsApp success!
                  </h2>
                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                    From small startups to enterprise companies, AvenPing scales with your business needs and delivers
                    results.
                  </p>
                </div>
                
                <img
          src="/whatsapp-dashboard.png"
          width={500}
          height={500}
          alt="linear demo image"
          className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
        />
                
              </WobbleCard>
            </div>
          </div>

          {/* Customer Testimonials Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What Our <span className="text-cyan-600">Customers Say</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what real businesses are saying about AvenPing.
              </p>
            </div>
            <InfiniteMovingCardsDemo />
          </div>

          {/* Final CTA Section */}
          <div className="text-center py-16 relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your WhatsApp Business?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using AvenPing to streamline their WhatsApp communications and boost
              customer engagement.
            </p>

            {/* Email Signup */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-12">
              <input
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm bg-white/80"
              />
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full whitespace-nowrap">
                Start Free Trial
              </Button>
            </div>

            
          </div>

        </div>
         <Footer/>
      </div>
    </div>
  )
}
