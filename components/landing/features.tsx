"use client";

import type React from "react";

import Tag from "@/components/landing/ui/tag";
import avatar1 from "@/public/images/avatar-ashwin-santiago.jpg";
import avatar2 from "@/public/images/avatar-florence-shaw.jpg";
import avatar3 from "@/public/images/avatar-lula-meyers.jpg";
import Image from "next/image";
import Avatar from "@/components/landing/ui/avatar";
import {
  MessageCircle,
  BarChart3,
  Users,
  Bot,
  Shield,
  Sparkles,
  Globe,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlowingEffect } from "@/components/landing/ui/glowing-effect";

const features = [
  "Auto Replies",
  "Bulk Messaging",
  "Contact Management",
  "Analytics Dashboard",
  "Message Templates",
  "Team Collaboration",
  "API Integration",
];

const parentVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  children,
  className,
}: FeatureCardProps) => {
  return (
    <div className={`relative h-full min-h-[20rem] ${className}`}>
      <div className="relative h-full rounded-2xl border border-gray-200 p-2 bg-white/50 backdrop-blur-sm">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow={true}
          disabled={false}
          proximity={80}
          inactiveZone={0.01}
          movementDuration={1.5}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 bg-white/80 backdrop-blur-sm border border-gray-100">
          <div className="relative flex flex-1 flex-col justify-between gap-4">
            <div className="w-fit rounded-xl border border-gray-200 p-3 bg-gradient-to-br from-cyan-50 to-blue-50">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-xl text-gray-900 leading-tight">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
            {children && (
              <div className="flex-1 flex items-center justify-center mt-4">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/80">
      <div className="container">
        <div className="flex justify-center">
          <Tag>Features</Tag>
        </div>
        <h2 className="text-6xl font-medium text-center mt-6 max-w-2xl m-auto text-gray-900">
          Everything you need for{" "}
          <span className="text-cyan-600">WhatsApp Business</span>
        </h2>

        <motion.div
          variants={parentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Team Collaboration - Large Card */}
            <motion.div variants={cardVariants} className="lg:col-span-2">
              <FeatureCard
                title="Team Collaboration"
                description="Work together seamlessly with your team on WhatsApp conversations. Assign chats, share notes, and collaborate in real-time."
                icon={<Users size={24} className="text-cyan-600" />}
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center">
                    <Avatar className="z-40 border-2 border-cyan-500">
                      <Image
                        src={avatar1 || "/placeholder.svg"}
                        alt="Avatar 1"
                        className="rounded-full"
                      />
                    </Avatar>
                    <Avatar className="-ml-4 border-2 border-blue-500 z-30">
                      <Image
                        src={avatar2 || "/placeholder.svg"}
                        alt="Avatar 2"
                        className="rounded-full"
                      />
                    </Avatar>
                    <Avatar className="-ml-4 border-2 border-purple-500 z-20">
                      <Image
                        src={avatar3 || "/placeholder.svg"}
                        alt="Avatar 3"
                        className="rounded-full"
                      />
                    </Avatar>
                    <Avatar className="-ml-4 border-2 border-gray-300 z-10">
                      <div className="rounded-full flex justify-center items-center size-full bg-gray-100">
                        <span className="text-gray-600 font-medium text-sm">
                          +5
                        </span>
                      </div>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      8 Members
                    </p>
                    <p className="text-sm text-gray-500">Active Now</p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Smart Analytics */}
            <motion.div variants={cardVariants}>
              <FeatureCard
                title="Smart Analytics"
                description="Track message performance and customer engagement with detailed insights and real-time metrics."
                icon={<BarChart3 size={24} className="text-cyan-600" />}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <BarChart3 size={48} className="text-cyan-500 mx-auto" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">
                      <span className="text-cyan-600">94%</span>
                    </p>
                    <p className="text-sm text-gray-500">Response Rate</p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Automated Responses */}
            <motion.div variants={cardVariants}>
              <FeatureCard
                title="Automated Responses"
                description="Set up intelligent auto-replies to handle customer inquiries 24/7 with smart AI-powered responses."
                icon={<Bot size={24} className="text-cyan-600" />}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Bot
                      size={48}
                      className="text-cyan-500 mx-auto animate-pulse"
                    />
                    <Sparkles
                      size={16}
                      className="absolute -top-2 -right-2 text-yellow-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-700">
                      Always Available
                    </p>
                    <p className="text-xs text-gray-500">24/7 Support</p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Bulk Messaging */}
            <motion.div variants={cardVariants}>
              <FeatureCard
                title="Bulk Messaging"
                description="Send personalized messages to thousands of contacts instantly with advanced targeting and scheduling."
                icon={<MessageCircle size={24} className="text-cyan-600" />}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <MessageCircle
                      size={48}
                      className="text-cyan-500 mx-auto"
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">99+</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">10K+</p>
                    <p className="text-sm text-gray-500">Messages/Hour</p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Security & Compliance */}
            <motion.div variants={cardVariants}>
              <FeatureCard
                title="Security & Compliance"
                description="Enterprise-grade security with end-to-end encryption and GDPR compliance for your business communications."
                icon={<Shield size={24} className="text-cyan-600" />}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Shield size={48} className="text-green-500 mx-auto" />
                    <Lock
                      size={16}
                      className="absolute -bottom-1 -right-1 text-gray-600"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">
                      Secured
                    </p>
                    <p className="text-xs text-gray-500">
                      End-to-End Encrypted
                    </p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div>

            {/* Global Reach */}
            {/* <motion.div variants={cardVariants}>
              <FeatureCard
                title="Global Reach"
                description="Connect with customers worldwide with multi-language support and international messaging capabilities."
                icon={<Globe size={24} className="text-cyan-600" />}
              >
                <div className="text-center space-y-4">
                  <div className="relative">
                    <Globe
                      size={48}
                      className="text-blue-500 mx-auto animate-spin"
                      style={{ animationDuration: "10s" }}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">180+</p>
                    <p className="text-sm text-gray-500">Countries Supported</p>
                  </div>
                </div>
              </FeatureCard>
            </motion.div> */}
          </div>
        </motion.div>

        {/* Feature Tags */}
        <div className="my-8 flex items-center justify-center flex-wrap gap-2 max-w-3xl m-auto">
          {features.map((feature) => (
            <div
              className="bg-white border border-gray-200 inline-flex px-3 md:px-5 md:py-2 py-1.5 rounded-2xl gap-3 items-center hover:scale-105 transition duration-500 group shadow-sm"
              key={feature}
            >
              <span className="bg-cyan-500 text-white size-5 rounded-full inline-flex items-center justify-center text-xl group-hover:rotate-45 transition duration-500">
                &#10038;
              </span>
              <span className="font-medium md:text-lg text-gray-700">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
