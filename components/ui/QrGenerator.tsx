import React from "react";
import { Button } from "./button";
import { QrCode } from "lucide-react";
const QrGenerator = () => {
  return (
    <div className="relative p-8 bg-gradient-to-b from-white to-gray-200 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 transform rotate-10 flex justify-end items-center">
        <QrCode className="w-40 h-40 text-gray-400" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">QR Generator</h2>
        <p className="text-md text-gray-700 mb-4">
          Create your custom QR codes easily and quickly.
        </p>
        <Button
          variant="default"
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          <span className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Generate QR Code
          </span>
        </Button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-200 to-transparent"></div>
    </div>
  );
};

export default QrGenerator;
