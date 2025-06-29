"use client";

import { AnimationPlaybackControls, motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Button from "@/components/landing/ui/button";

export default function CallToAction() {
  const animation = useRef<AnimationPlaybackControls | null>(null);
  const [scope, animate] = useAnimate();

  const [slowDownAnimation, setSlowDownAnimation] = useState(false);

  useEffect(() => {
    animation.current = animate(
      scope.current,
      { x: "-50%" },
      { duration: 30, ease: "linear", repeat: Infinity }
    );
  }, []);

  useEffect(() => {
    if (animation.current) {
      if (slowDownAnimation) {
        animation.current.speed = 0.5;
      } else {
        animation.current.speed = 1;
      }
    }
  }, [slowDownAnimation]);

  return (
    <section className="py-24 bg-white">
      <div className="overflow-x-clip p-4 flex">
        <motion.div
          ref={scope}
          className="flex flex-none gap-16 pr-16 text-6xl md:text-8xl font-medium text-gray-900"
          onMouseEnter={() => setSlowDownAnimation(true)}
          onMouseLeave={() => setSlowDownAnimation(false)}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="flex items-center gap-16">
              <span className="text-cyan-600 text-7xl">&#10038;</span>
              <span className={twMerge(slowDownAnimation && "text-cyan-600 text-7xl")}
              style={{ fontSize: "inherit" }}>
                Start for free
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="text-center mt-8">
        <Link href="/signup">
          <Button variant="primary" className="text-lg px-8 h-14">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
