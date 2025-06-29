import Button from "@/components/landing/ui/button";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";

const platformLinks = [
  { href: "#", label: "Features" },
  { href: "#", label: "Pricing" },
  { href: "#", label: "Insights" },
];

const companyLinks = [
  { href: "#", label: "About" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Contact" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
];

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Youtube, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      {/* Newsletter Section */}
      <div className="border-b border-gray-200">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Join our newsletter to keep up to date with us!
              </h3>
            </div>
            <div
              className="flex flex-col
md:flex-row items-center justify-center md:justify-start
             gap-3 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white border border-gray-300 px-4 py-2 flex-1 min-w-[300px] text-gray-900 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:lg:gap-12 lg:gap-20">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-cyan-600">AvenPing</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">
              A simple CRM that is easy to use and easy to manage
            </p>
          </div>

          {/* Empty space for alignment */}
          <div className="hidden lg:block"></div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <nav className="flex flex-col gap-3">
              {platformLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <nav className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <nav className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-cyan-600 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            {/* Center Links */}
            <div className="flex gap-6">
              <a
                href="#"
                className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
              >
                English
              </a>
              <a
                href="#"
                className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-600 text-sm hover:text-cyan-600 transition-colors"
              >
                Legal
              </a>
            </div>

            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © 2024 Aven Technologies Inc. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
