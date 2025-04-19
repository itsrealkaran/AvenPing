import React from "react";
import { Button } from "./button";
import { GrConnect } from "react-icons/gr";

const WhatsappAccountConnection = () => {
  return (
    <div className="relative p-8 bg-gradient-to-b from-white to-purple-200 border border-purple-300 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 transform rotate-10 flex justify-end items-center">
        <GrConnect className="w-40 h-40 text-purple-400" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-purple-800">
          WhatsApp Account Connection
        </h2>
        <p className="text-md text-purple-700 mb-4">
          Connect your WhatsApp account easily and securely.
        </p>
        <Button
          variant="default"
          className="bg-purple-800 text-white hover:bg-purple-700"
        >
          <span className="flex items-center gap-2">
            <GrConnect className="w-4 h-4" />
            Connect Account
          </span>
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-purple-200 to-transparent"></div>
    </div>
  );
};

export default WhatsappAccountConnection;
