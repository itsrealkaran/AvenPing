import React from "react";
import { Button } from "./button";
import { FaBusinessTime } from "react-icons/fa6";

const BusinessVerification = () => {
  return (
    <div className="relative p-6 bg-gradient-to-b from-red-100 to-red-200 border border-red-300 rounded-lg shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 transform rotate-10 flex justify-end items-center">
        {/* Add any background icon or image here if needed */}
        <FaBusinessTime className="w-40 h-40 text-red-400" />
      </div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-2 text-red-800">
          Business Verification
        </h2>
        <p className="text-md text-red-700 mb-4">
          Ensure your business is verified to gain customer trust and access
          additional features.
        </p>

        <Button
          variant="default"
          className="bg-red-500 text-white hover:bg-red-400"
        >
          <FaBusinessTime className="w-40 h-40 text-white" />
          Verify Business
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-red-200 to-transparent"></div>
    </div>
  );
};

export default BusinessVerification;
