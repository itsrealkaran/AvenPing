import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

function HeaderBanner() {
  return (
    <div className="flex items-center justify-between w-full bg-blue-50 p-4 rounded-lg border border-brand-color-light">
      <div className="flex items-center gap-4">
        <Image
          src="/logo-main.svg"
          alt="Logo"
          width={28}
          height={28}
          className=""
        />
        <div>
          <h2 className="text-lg text-brand-color font-semibold text-gray-800">
            Welcome to AvenPing
          </h2>
          <p className="text-sm text-gray-600 text-brand-color-dark">
            Streamline your business operations with our innovative solutions.
          </p>
        </div>
      </div>
      <button className="bg-brand-color  text-white font-medium rounded px-4 py-2 hover:bg-blue-600 flex items-center gap-2">
        Learn More
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export default HeaderBanner;
