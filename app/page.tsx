import React from "react";
import QrGenerator from "../components/ui/QrGenerator";
import WhatsappButton from "../components/ui/WhatsappButton";
import NumberRegister from "../components/ui/NumberRegister";
import BusinessVerification from "../components/ui/BusinessVerification";
import WhatsappAccountConnection from "../components/ui/WhatsappAccountConnection";
import HeaderBanner from "@/components/header-banner";

function page() {
  return (
    <div className="flex items-center justify-center flex-col px-10">
      <HeaderBanner />
      <div className="flex items-start justify-start flex-col mt-10">
        <h1 className="text-3xl font-bold">
          Automate your business with{" "}
          <span className="font-sans italic border-b-3 border-dashed border-brand-color">
            AvenPing
          </span>
        </h1>
        <h2 className="text-md text-gray-600 mt-2 font-medium">
          Streamline operations and enhance productivity with our innovative
          solutions.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        <QrGenerator />
        <WhatsappButton />
        <NumberRegister />
        <BusinessVerification />
        <WhatsappAccountConnection />
      </div>
    </div>
  );
}

export default page;
