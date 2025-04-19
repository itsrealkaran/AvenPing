import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Header() {
  return (
    <header className="bg-sidebar text-white p-4  border-b w-full">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-6">
          <Button variant={"ghost"} className="">
            <div className="text-gray-400 font-semibold">
              <span>Register</span>
            </div>
          </Button>
          <Button
            variant={"secondary"}
            className="bg-green-500 hover:bg-green-600"
          >
            <div className="text-white font-medium transition-colors duration-300">
              <span>Connect Whatsapp</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
