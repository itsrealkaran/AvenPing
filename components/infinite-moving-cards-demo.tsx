"use client"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"

export default function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[20rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  )
}

const testimonials = [
  {
    quote:
      "AvenPing has completely transformed how we handle customer communications. Our response time improved by 300% and customer satisfaction is at an all-time high.",
    name: "Sarah Johnson",
    title: "CEO, TechStart Solutions",
  },
  {
    quote:
      "The automation features are incredible. We can now handle thousands of WhatsApp messages without missing a single customer inquiry. It's been a game-changer for our business.",
    name: "Michael Chen",
    title: "Operations Manager, E-commerce Plus",
  },
  {
    quote:
      "What impressed me most is the seamless integration with our existing CRM. AvenPing made it so easy to centralize all our customer data in one place.",
    name: "Emily Rodriguez",
    title: "Marketing Director, Growth Co",
  },
  {
    quote:
      "The analytics dashboard gives us insights we never had before. We can now make data-driven decisions about our customer engagement strategy.",
    name: "David Thompson",
    title: "Customer Success Lead, InnovateTech",
  },
  {
    quote:
      "AvenPing's team collaboration features have made our support team 10x more efficient. We can assign chats, share notes, and work together seamlessly.",
    name: "Lisa Park",
    title: "Support Manager, ServiceFirst",
  },
]
