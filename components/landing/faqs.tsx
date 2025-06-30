"use client";

import Tag from "@/components/landing/ui/tag";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const faqs = [
  {
    question: "How is AvenPing different from other WhatsApp tools?",
    answer:
      "AvenPing focuses specifically on business communication efficiency with advanced automation, team collaboration features, and detailed analytics that help you understand your customer interactions better.",
  },
  {
    question: "Is there a learning curve?",
    answer:
      "AvenPing is designed to be intuitive from day one. Most users are productive within minutes, not hours. We provide comprehensive onboarding and 24/7 support to help you get started.",
  },
  {
    question: "How do you handle message history and data?",
    answer:
      "All your conversations are securely stored and easily searchable. You can export data anytime, and we provide detailed analytics on message performance and customer engagement.",
  },
  {
    question: "Can I use AvenPing offline?",
    answer:
      "AvenPing requires an internet connection to sync with WhatsApp. However, you can draft messages and prepare templates offline, which will be sent once you're back online.",
  },
  {
    question: "How does team collaboration work?",
    answer:
      "Multiple team members can manage the same WhatsApp number, with role-based permissions, internal notes, and conversation assignment features to ensure smooth collaboration.",
  },
];

export default function Faqs() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container max-w-6xl mx-auto p-[1rem] sm:p-[0rem]">
        <div className="flex justify-center">
          <Tag>FAQs</Tag>
        </div>
        <h2 className="text-6xl font-medium mt-6 text-center max-w-xl mx-auto text-gray-900">
          Questions? We&apos;ve got{" "}
          <span className="text-cyan-600">answers</span>
        </h2>

        <div className="mt-12 flex flex-col gap-6 max-w-6xl mx-auto">
          {faqs.map((faq, faqIndex) => (
            <div
              key={faq.question}
              onClick={() => setSelectedIndex(faqIndex)}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium m-0 text-gray-900">
                  {faq.question}
                </h3>
                <Plus
                  size={30}
                  className={twMerge(
                    "text-cyan-600 flex-shrink-0 transition duration-300",
                    selectedIndex === faqIndex && "rotate-45"
                  )}
                />
              </div>

              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{
                      height: 0,
                      marginTop: 0,
                    }}
                    animate={{
                      height: "auto",
                      marginTop: 24,
                    }}
                    exit={{
                      height: 0,
                      marginTop: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
