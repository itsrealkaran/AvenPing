import React from "react";
import { Button } from "./button";
import { ImWhatsapp } from "react-icons/im";
import { PiCashRegisterDuotone } from "react-icons/pi";

const NumberRegister = () => {
  return (
    <div className="relative p-8 bg-gradient-to-b from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 transform rotate-10 flex justify-end items-center">
        <PiCashRegisterDuotone className="w-40 h-40 text-yellow-400" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-yellow-800">
          Number Register
        </h2>
        <p className="text-md text-yellow-700 mb-4">
          Easily register your number to stay updated with the latest news and
          offers.
        </p>
        <Button
          variant="default"
          className="bg-yellow-500 text-white hover:bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-105"
        >
          <span className="flex items-center gap-2">
            <PiCashRegisterDuotone className="w-4 h-4" />
            Register Now
          </span>
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-yellow-200 to-transparent"></div>
    </div>
  );
};

export default NumberRegister;
