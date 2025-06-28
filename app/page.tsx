"use client"
import CallToAction from "@/components/landing/call-to-action";
import Faqs from "@/components/landing/faqs";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
import Integrations from "@/components/landing/integrations";
import Introduction from "@/components/landing/introduction";
import LogoTicker from "@/components/landing/logo-ticker";
import Navbar from "@/components/landing/navbar";
import Pricing from "@/components/landing/pricing";
import LocomotiveScroll from "locomotive-scroll";
import { useEffect } from "react";
import { useRef } from "react";

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null)
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initLocomotiveScroll = () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy()
      }

      const locomotiveScroll = new LocomotiveScroll({
        lenisOptions: {
          wrapper: window,
          content: document.documentElement,
          lerp: 0.1,
          duration: 1.2,
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        },
        autoStart: true,
      })

      locomotiveScrollRef.current = locomotiveScroll
    }

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initLocomotiveScroll, 100)

    return () => {
      clearTimeout(timer)
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy()
      }
    }
  }, [])
    return (
        <div ref={scrollRef} data-scroll-container>
            <Navbar />
            <Hero />
            <LogoTicker />
            <Introduction />
            <Features />
            <Integrations />
            <Pricing />
            <Faqs />
            <CallToAction />
            <Footer />
        </div>
    );
}