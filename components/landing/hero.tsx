"use client";

import Button from "@/components/landing/ui/button";
import designExample1 from "@/public/images/img1.png";
import designExample2 from "@/public/images/img2.png";
import designExample3 from "@/public/images/img3.png";
import Image from "next/image";
import Pointer from "@/components/landing/ui/pointer";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  const [leftDesignScope, leftDesignAnimate] = useAnimate();
  const [leftPointerScope, leftPointerAnimate] = useAnimate();

  const [rightDesignScope, rightDesignAnimate] = useAnimate();
  const [rightPointerScope, rightPointerAnimate] = useAnimate();

  const [leftDesignScope2, leftDesignAnimate2] = useAnimate();

  useEffect(() => {
    leftDesignAnimate([
      [leftDesignScope.current, { opacity: 1 }, { duration: 0.5 }],
      [leftDesignScope.current, { y: 0, x: 0 }, { duration: 0.5 }],
    ]);

    leftPointerAnimate([
      [leftPointerScope.current, { opacity: 1 }, { duration: 0.5 }],
      [leftPointerScope.current, { y: 0, x: -100 }, { duration: 0.5 }],
      [
        leftPointerScope.current,
        { y: [0, 16, 0], x: 0 },
        { duration: 0.5, ease: "easeInOut" },
      ],
    ]);

    leftDesignAnimate2([
      [leftDesignScope2.current, { opacity: 1 }, { duration: 0.5, delay: 1 }],
      [leftDesignScope2.current, { y: 0, x: 0 }, { duration: 0.5 }],
    ]);

    rightDesignAnimate([
      [rightDesignScope.current, { opacity: 1 }, { duration: 0.5, delay: 1.5 }],
      [rightDesignScope.current, { y: 0, x: 0 }, { duration: 0.5 }],
    ]);

    rightPointerAnimate([
      [
        rightPointerScope.current,
        { opacity: 1 },
        { duration: 0.5, delay: 1.5 },
      ],
      [rightPointerScope.current, { y: 200, x: 175 }, { duration: 0.5 }],
      [
        rightPointerScope.current,
        { y: [200, 220, 200], x: 0 },
        { duration: 0.5, ease: "easeInOut" },
      ],
    ]);
  }, [
    leftDesignAnimate,
    leftDesignAnimate2,
    leftDesignScope,
    leftDesignScope2,
    leftPointerAnimate,
    leftPointerScope,
    rightDesignAnimate,
    rightDesignScope,
    rightPointerAnimate,
    rightPointerScope,
  ]);

  return (
    <section
      className="py-20 md:py-24 overflow-x-clip bg-gradient-to-b from-cyan-100 via-purple-100 to-white 
        w-full relative lg:h-[calc(100vh)] 
        "
    >
      <div className="container relative ">
        <motion.div
          ref={leftDesignScope}
          initial={{ opacity: 0, y: 400, x: 0 }}
          className="absolute inset-0 top-[30rem] hidden lg:block pointer-events-none backdrop-blur-lg"
          style={{ zIndex: 1 }}
        >
          <Image
            draggable={false}
            src={designExample1}
            alt="WhatsApp business example 1"
            className="rounded-lg shadow-lg pointer-events-none"
            style={{
              maxWidth: "100%",
              height: "auto",
              border: "4px solid transparent",
              borderRadius: "0.5rem",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              backgroundImage:
                "linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.3) 100%)",
            }}
          />
        </motion.div>
        <motion.div
          ref={leftPointerScope}
          initial={{ opacity: 0, y: 100, x: -200 }}
          className="absolute top-[32rem] left-56 hidden lg:block"
          style={{ zIndex: 2 }}
        >
          <Pointer name="Karan" />
        </motion.div>

        {/* the metric card thing */}
        <motion.div
          initial={{ opacity: 0, y: 100, x: -100 }}
          ref={leftDesignScope2}
          className="absolute -left-[3rem] -top-[4rem] hidden lg:block"
          drag
          dragConstraints={{
            left: 0,
            right: typeof window !== "undefined" ? window.innerWidth - 400 : 0,
            top: 0,
            bottom:
              typeof window !== "undefined" ? window.innerHeight - 300 : 0,
          }}
          dragElastic={0.5}
          onDragEnd={(event, info) => {
            setTimeout(() => {
              leftDesignAnimate2([
                [
                  leftDesignScope2.current,
                  { x: 0, y: 0 },
                  { duration: 0.8, ease: "easeInOut" },
                ],
              ]);
            }, 3000);
          }}
          style={{ zIndex: 1 }}
        >
          <Image
            draggable={false}
            src={designExample3}
            alt="WhatsApp business example 3"
            className=" shadow-lg"
            style={{
              maxWidth: "60%",
              height: "auto",
              border: "4px solid transparent",
              borderRadius: "1rem",
              // borderRadius: "0.5rem",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              backgroundImage:
                "linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.3) 100%)",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, x: 100 }}
          ref={rightDesignScope}
          className="absolute -right-[29rem] top-[10rem] hidden lg:block"
          drag
          dragConstraints={{
            left: 0,
            right: typeof window !== "undefined" ? window.innerWidth - 400 : 0,
            top: 0,
            bottom:
              typeof window !== "undefined" ? window.innerHeight - 300 : 0,
          }}
          dragElastic={0.5}
          onDragEnd={(event, info) => {
            const node = rightDesignScope.current;
            if (!node) return;
            const rect = node.getBoundingClientRect();
            const minX = 0;
            const maxX = window.innerWidth - rect.width;
            const minY = 0;
            const maxY = window.innerHeight - rect.height;
            let x = rect.left;
            let y = rect.top;
            let bounce = false;
            if (x < minX) {
              x = minX;
              bounce = true;
            }
            if (x > maxX) {
              x = maxX;
              bounce = true;
            }
            if (y < minY) {
              y = minY;
              bounce = true;
            }
            if (y > maxY) {
              y = maxY;
              bounce = true;
            }
            if (bounce) {
              rightDesignAnimate([
                [
                  rightDesignScope.current,
                  { x: x - rect.left, y: y - rect.top },
                  { type: "spring", stiffness: 30 },
                ],
              ]);
            }
            setTimeout(() => {
              rightDesignAnimate([
                [
                  rightDesignScope.current,
                  { x: 0, y: 0 },
                  { duration: 0.8, ease: "easeInOut" },
                ],
              ]);
            }, 3000);
          }}
          style={{ zIndex: 1 }}
        >
          <Image
            draggable={false}
            src={designExample2}
            alt="WhatsApp business example 2"
            className="rounded-lg shadow-lg"
            style={{
              maxWidth: "40%",
              height: "auto",
              border: "4px solid transparent",
              borderRadius: "0.5rem",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              backgroundImage:
                "linear-gradient(to bottom right, rgba(255,255,255,0.7), rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.3) 100%)",
            }}
          />
        </motion.div>

        <motion.div
          ref={rightPointerScope}
          initial={{ opacity: 0, x: 275, y: 200 }}
          className="absolute -top-4 right-80 hidden lg:block"
          style={{ zIndex: 2 }}
        >
          <Pointer color="blue" name="Vib" />
        </motion.div>

        <div
          className="flex justify-center"
          style={{ zIndex: 10, position: "relative" }}
        >
          <div className="inline-flex py-1 px-3 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full text-white font-semibold">
            🚀 Trusted by 10,000+ businesses
          </div>
        </div>
        <h1
          className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6 text-gray-900 selection:bg-yellow-300 selection:text-black"
          style={{ zIndex: 10, position: "relative" }}
        >
          WhatsApp Business, <span className="text-cyan-600">simplified</span>
        </h1>
        <p
          className="selection:bg-yellow-300 selection:text-black text-center text-xl text-gray-600 mt-8 max-w-2xl mx-auto"
          style={{ zIndex: 10, position: "relative" }}
        >
          Streamline your WhatsApp business communications with powerful
          automation, analytics, and customer management tools.
        </p>
        <form
          className="mx-auto flex border border-gray-300 rounded-full gap-2 p-2 mt-8 max-w-lg bg-white shadow-sm"
          style={{ zIndex: 10, position: "relative" }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent px-4 flex-1 w-full text-gray-900 rounded-full placeholder-gray-500"
          />
          <Link href="/signup">
            <Button
              size="sm"
              className="whitespace-nowrap"
              type="button"
              variant="primary"
            >
              Get Started
            </Button>
          </Link>
        </form>
      </div>
    </section>
  );
}
