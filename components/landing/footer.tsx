"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Linkedin, User2, Youtube } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Logo from "@/components/landing/logo"

const footerLinks = {
  Platform: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Insights", href: "/insights" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ],
}

const socialLinks = [
  { icon: Facebook, href: "http://facebook.com/avencrm" },
  { icon: Instagram, href: "https://instagram.com/avencrm_" },
  // { icon: Twitter, href: "#" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/aven-crm/" },
  { icon: Youtube, href: "https://youtube.com/@avencrm" },
]

export function Footer() {
  return (
    // <footer className="border-t border-gray-200">
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 p-[1rem] sm:p-[0rem]">
        {/* Logo and Newsletter Section */}
        {/* <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold font-mono">
            Join our newsletter to keep<br /> up to date with us!
            </h3>
          </div>
          
          <div>
            <form className="flex gap-2">
              <div className="relative flex-grow">
                <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-10 h-12 rounded-full bg-white border-[#e6e6e6]"
                />
              </div>
              <Button 
                type="submit"
                className="violet-500 hover:bg-[#00bdbd]/90 text-white rounded-full px-8 h-12"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div> */}

        {/* Links Section */}
        <div className="grid md:grid-cols-2 mb-16 md:mb-28 pt-8  border-[#dddddd]">
            <div className="hidden md:flex flex-col justify-between">
              <Link href="/" className="flex items-center gap-[2px] mb-6">
                <div className='text-[1.6rem] md:text-[2rem]'>
                  <Logo variant='black'/>
                </div>
                <div
                className='text-[1rem] md:text-[1.3rem] flex gap-[2px] items-end font-bold'
                  >
                  <h1>AvenCRM</h1>
                </div>
              </Link>
              <p className="text-[#5c5f66] max-w-sm">
                A simple CRM that is easy to use and easy to manage.
              </p>
            </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#444444] mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-[#111111] hover:text-[#000000] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#d6d6d6]">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            {socialLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link 
                  key={index} 
                  href={link.href}
                  className="text-[#5c5f66] hover:text-[#000000] transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-6 text-sm text-[#5c5f66]">
            <button className="hover:text-[#000000] transition-colors">
              English
            </button>
            <Link href="/privacy-policy" className="hover:text-[#000000] transition-colors">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#000000] transition-colors">
              Legal
            </Link>
          </div>

          <div className="text-sm text-[#5c5f66] mt-4 md:mt-0">
            © 2024 Aven Technologies Inc. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}