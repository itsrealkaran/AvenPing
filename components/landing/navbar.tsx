"use client";

import { Menu, X } from "lucide-react";
import Button from "@/components/landing/ui/button";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Features", href: "#features" },
  { label: "Insights", href: "/insights" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.section
        className="pb-4 lg:pb-8 fixed w-full top-0 z-50"
        animate={{
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0)"
            : "rgba(255, 255, 255, 0)",
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`container transition-all duration-300 ${
            isScrolled ? "max-w-5xl" : "max-w-full px-0"
          }`}
        >
          <motion.div
            className={`transition-all duration-300 ${
              isScrolled
                ? "border border-gray-200 rounded-[27px] lg:rounded-full bg-white/70 backdrop-blur shadow-sm"
                : "bg-white/90 backdrop-blur "
            }`}
            animate={{
              borderRadius: isScrolled ? "50px" : "0px",
              marginTop: isScrolled ? "16px" : "0",
              backgroundColor: isScrolled
                ? "rgba(255, 255, 255, 0.7)"
                : "transparent",
              boxShadow: isScrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
            }}
            transition={{ duration: 0.3 }}
          >
            <figure
              className={`grid grid-cols-2 lg:grid-cols-3 py-2 items-center ${
                isScrolled ? "lg:px-2 px-4" : "px-4 lg:px-8"
              }`}
            >
              <div>
                <div className="text-2xl font-bold text-cyan-600 px-5">
                  AvenPing
                </div>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <nav className="flex gap-6 font-medium text-gray-700">
                  {navLinks.map((each) => (
                    <Link
                      href={each.href}
                      key={each.href}
                      className="hover:text-cyan-600 transition-colors"
                    >
                      {each.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden"
                >
                  {!isOpen ? (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{
                        opacity: isOpen ? 0 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Menu className="text-gray-700" size={25} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <X className="text-gray-700" size={30} />
                    </motion.div>
                  )}
                </button>
                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="hidden lg:inline-flex items-center"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="primary"
                    className="hidden lg:inline-flex items-center"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </figure>

            <AnimatePresence>
              {isOpen && (
                <motion.figure
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden lg:hidden"
                >
                  <div className="flex flex-col items-center gap-4 py-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-gray-700 hover:text-cyan-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link href="/login" className="w-3/4">
                      <Button className="w-full" variant="secondary">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-3/4">
                      <Button className="w-full" variant="primary">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </motion.figure>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.section>
      <div className="pb-[86px] md:pb-[98px]"></div>
    </>
  );
}
