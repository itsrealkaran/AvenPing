"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  MessageCircle,
  BarChart3,
  Users,
  Bot,
  Shield,
  Sparkles,
  Globe,
  Lock,
  Zap,
  TrendingUp,
  FileText,
  Settings,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  Eye,
  ChevronRight,
} from "lucide-react"
import { motion } from "framer-motion"
import Navbar from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Features2 from "@/components/landing/features2"

// Mock avatar images - replace with actual avatar imports
const avatar1 = "/placeholder.svg?height=40&width=40"
const avatar2 = "/placeholder.svg?height=40&width=40"
const avatar3 = "/placeholder.svg?height=40&width=40"

const features = [
  "Auto Replies",
  "Bulk Messaging",
  "Contact Management",
  "Analytics Dashboard",
  "Message Templates",
  "Team Collaboration",
  "API Integration",
]

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  children?: React.ReactNode
  className?: string
}

const FeatureCard = ({ title, description, icon, children, className }: FeatureCardProps) => {
  return (
    <div className={`relative h-full min-h-[20rem] ${className}`}>
      <div className="relative h-full rounded-2xl border border-gray-200 p-2 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 bg-white/80 backdrop-blur-sm border border-gray-100">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-cyan-50 to-blue-50">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-xl text-gray-900 leading-tight">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
            {children && <div className="flex-1 flex items-center justify-center mt-4">{children}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

const Tag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium">
    <Sparkles size={16} />
    {children}
  </div>
)

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary"
  className?: string
  [key: string]: any
}) => {
  const baseClasses = "px-6 py-3 rounded-full font-medium transition-all duration-200 inline-flex items-center gap-2"
  const variants = {
    primary: "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-cyan-600 border border-cyan-200 hover:bg-cyan-50",
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-b from-cyan-100 via-purple-100 to-white min-h-screen">
      <Navbar/>
      {/* Hero Section */}
      <section className="py-20 md:py-24 overflow-hidden bg-gradient-to-b from-cyan-100 via-purple-100 to-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Tag>New & Improved  Features</Tag>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-8 leading-tight">
              Explore AvenPing's
              <br />
              <span className="text-cyan-600">Powerful Features</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Discover how AvenPing's cutting-edge features can transform the way you manage your WhatsApp business
              communications. We provide everything you need to make smarter, data-driven decisions and optimize your
              customer engagement.
            </p>

           
          </div>

          
          <Features2/>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Discover Benefits
              </div>
            </div>
            <h2 className="text-5xl md:text-6xl font-medium text-gray-900 mb-6 leading-tight">
              Unlock The Full Potential Of Your
              <br />
              <span className="text-cyan-600">WhatsApp Business</span> With AvenPing
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the benefits that make AvenPing the perfect solution for businesses looking to optimize their
              WhatsApp communications, improve productivity, and drive smarter customer engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Clock size={24} className="text-cyan-600" />,
                title: "Save Time on Customer Support",
                description:
                  "Automate repetitive tasks like message routing and basic responses, freeing up your team to focus on complex customer needs.",
                link: "View More...",
              },
              {
                icon: <Target size={24} className="text-cyan-600" />,
                title: "Improve Customer Engagement",
                description:
                  "Reduce response times and increase customer satisfaction with automated tools and real-time message management.",
                link: "View More...",
              },
              {
                icon: <TrendingUp size={24} className="text-cyan-600" />,
                title: "Boost Business Growth",
                description:
                  "Allow your teams to collaborate more effectively by providing a shared platform for managing customer conversations.",
                link: "View More...",
              },
              {
                icon: <BarChart3 size={24} className="text-cyan-600" />,
                title: "Simplify Analytics & Reporting",
                description:
                  "Easily create and adjust marketing campaigns with AvenPing's simple yet powerful tools, ensuring maximum ROI.",
                link: "View More...",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl flex items-center justify-center mb-6 border border-gray-200">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{benefit.description}</p>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors">
                  {benefit.link}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Interface mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gray-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-6 left-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                </div>

                <div className="mt-16 mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Insights</h3>
                  <p className="text-gray-600">Real-time analytics and forecasting</p>
                </div>

                <div className="space-y-4 mb-8">
                  <Button className="w-full justify-center">
                    <Globe size={20} />
                    Explore Features
                  </Button>
                </div>

                <div className="bg-cyan-500 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <Bot size={16} className="text-gray-900" />
                    </div>
                    <span className="font-medium">Unlock AI Insights</span>
                  </div>
                  <p className="text-sm opacity-90">Use AI to forecast customer behavior and optimize message timing</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-cyan-600 font-medium">AI INSIGHT</span>
              </div>

              <h2 className="text-4xl md:text-4xl font-medium text-gray-900 mb-6 leading-tight">
                Unlock Smarter Decisions
                <br />
                With <span className="text-cyan-600">AI-Powered Insights</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AvenPing's AI-driven analytics provide you with real-time, actionable insights to make smarter, more
                informed business decisions. Whether it's customer behavior analysis or message optimization, our AI
                technology helps you stay ahead of the curve.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Real-Time Data Analysis",
                    description:
                      "Get instant insights into your customer data, so you can act quickly and confidently.",
                  },
                  {
                    title: "Predictive Forecasting",
                    description:
                      "Use AI to predict customer trends and make data-driven decisions that will help you scale your business.",
                  },
                  {
                    title: "Personalized Recommendations",
                    description: "Receive tailored suggestions based on your unique business situation and history.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button>
                See More
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seamless Integration Section */}
      <section className="py-24 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-cyan-600 font-medium">SEAMLESS INTEGRATION</span>
              </div>

              <h2 className="text-4xl md:text-4xl font-medium text-gray-900 mb-6 leading-tight">
                Seamlessly Connect AvenPing
                <br />
                With Your <span className="text-cyan-600">Favorite Tools</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                AvenPing integrates smoothly with your existing platforms, allowing you to sync CRM systems, e-commerce
                platforms, and more. Consolidate your customer data in one place and streamline your operations.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Easy Data Syncing",
                    description: "Connect with top CRM platforms and e-commerce systems for seamless data flow.",
                  },
                  {
                    title: "Custom Integrations",
                    description:
                      "AvenPing supports a wide range of custom integrations to meet your business's unique needs.",
                  },
                  {
                    title: "Automated Syncing",
                    description:
                      "Save time by automating data transfers and updates between AvenPing and your other tools.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button>
                See More
                <ArrowRight size={20} />
              </Button>
            </motion.div>

            {/* Right side - Integration interface mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-cyan-600" />
                    <span className="font-semibold text-gray-900">WhatsApp Integration</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <CheckCircle size={16} />
                    Verified
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Integration Settings</span>
                      <Settings size={16} className="text-gray-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Stripe</div>
                        <div className="text-sm text-gray-600">Track payments seamlessly</div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-cyan-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="password"
                        value="sk_live_3u5K9H7DLJ258MW3ZNT"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        readOnly
                      />
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        <CheckCircle size={12} />
                        Verified
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Webhook Endpoint</label>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value="https://corporate-finance.io/api/v1/stripe-webhook"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        readOnly
                      />
                      <Button variant="secondary" className="px-3 py-2 text-sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Section */}
      <section className="py-24 bg-white">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Eye size={24} className="text-cyan-600" />
                    <span className="font-semibold text-gray-900">Message Analytics</span>
                  </div>
                  <div className="text-sm text-gray-500">Expense</div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">$102,235</span>
                    <span className="text-sm text-green-500 font-medium">↗ +22%</span>
                  </div>
                  <div className="text-sm text-gray-500">Monthly Revenue</div>
                </div>

                {/* Chart area */}
                <div className="h-48 bg-gray-50 rounded-xl mb-6 relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,150 Q100,120 200,100 T400,80" stroke="#06b6d4" strokeWidth="3" fill="none" />
                    <path d="M0,150 Q100,120 200,100 T400,80 L400,200 L0,200 Z" fill="url(#gradient1)" />
                  </svg>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Messages Sent</div>
                    <div className="font-semibold text-gray-900">$15,382</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Response Rate</div>
                    <div className="font-semibold text-gray-900">94.2%</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  6
                </div>
                <span className="text-cyan-600 font-medium">MESSAGE ANALYTICS</span>
              </div>

              <h2 className="text-4xl md:text-4xl font-medium text-gray-900 mb-6 leading-tight">
                Master Your Customer Engagement With
                <br />
                <span className="text-cyan-600">Advanced Analytics</span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Understand the performance of your WhatsApp business communications with AvenPing's in-depth analytics.
                Our platform allows you to track, manage, and forecast customer engagement so you can keep your business
                running smoothly.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  {
                    title: "Message Performance Tracking",
                    description:
                      "Monitor your message delivery rates and customer engagement in real-time, giving you insights into how customers interact with your business.",
                  },
                  {
                    title: "Real-Time Monitoring",
                    description:
                      "Monitor your customer interactions in real-time, giving you insights into how messages are performing through your business.",
                  },
                  {
                    title: "Response Rate Analysis",
                    description:
                      "Identify where you can improve efficiency by tracking response times and their impact on your overall customer satisfaction.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button>
                See More
                <ArrowRight size={20} />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Message Management Section */}
      <section className="py-24 ">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-full text-sm font-medium">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </span>
                MESSAGE MANAGEMENT
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 leading-tight">
              Create And Manage Messages <span className="text-cyan-600">Effortlessly</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AvenPing's message management system allows you to create, customize, and send messages in just a few
              clicks. Streamline your communication process and ensure timely responses with easy-to-use messaging
              tools.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left side - Message interface mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <FileText size={24} className="text-cyan-600" />
                  <span className="font-semibold text-gray-900">Message Templates</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">Template Type</span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <button className="px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg font-medium">Welcome</button>
                      <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">Follow-up</button>
                      <button className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg">Support</button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="text-sm font-medium text-gray-700 mb-2">Message Preview</div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                      Hi [Customer Name], welcome to our service! We're excited to help you get started...
                    </div>
                  </div>
                </div>

                <div className="flex justify-evenly gap-3">
                  <Button variant="secondary" className=" ">
                    Save Template
                  </Button>
                  <Button className="flex">Send Message</Button>
                </div>
              </div>
            </motion.div>

            {/* Right side - Features */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Customizable Templates */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Customizable Message Templates</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Use professional-looking, customizable templates that suit your brand's identity and messaging needs.
                </p>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">Learn More</button>
              </div>

              {/* Automated Messaging */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Automated Message Scheduling</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Automatically schedule and send messages to customers, saving you time and reducing manual errors.
                </p>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">Learn More</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      

      <Footer/>
    </div>
  )
}
