import React from "react";
import { Button } from "./button";
import { ImWhatsapp } from "react-icons/im";

const WhatsappButton = () => {
  return (
    <div className="relative p-8 bg-gradient-to-b from-green-100 to-green-200 border border-green-300 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 transform rotate-10 flex justify-end items-center">
        <ImWhatsapp className="w-40 h-40 text-green-400" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-green-800">WhatsApp</h2>
        <p className="text-md text-green-700 mb-4">
          Connect you bussiness with your customers instantly via WhatsApp.
        </p>
        <Button
          variant="default"
          className="bg-green-500 text-white hover:bg-green-400"
        >
          <span className="flex items-center gap-2">
            <ImWhatsapp className="w-4 h-4" />
            Open WhatsApp
          </span>
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-green-200 to-transparent"></div>
    </div>
  );
};

export default WhatsappButton;
