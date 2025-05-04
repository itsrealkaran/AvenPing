'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import Step1BasicInfo from "@/components/signup/Step1BasicInfo";
import Step2WhatsAppConnect from "@/components/signup/Step2WhatsAppConnect";
import Step3ProfileSetup from "@/components/signup/Step3ProfileSetup";

const Page: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    industry: "",
    size: "",
    email: "",
    password: "",
    
    // Step 3
    displayName: "",
    description: "",
    profilePic: null as File | null,
    headerPic: null as File | null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleSkipStep = () => {
    // If user skips WhatsApp connection, we'll prefill the display name
    if (currentStep === 2) {
      setFormData({
        ...formData,
        displayName: formData.name,
      });
    }
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Account created successfully!");
      
      // For demo purposes, we'll just reset the form
      // In a real app, you would redirect to the dashboard
      setCurrentStep(1);
      setFormData({
        name: "",
        industry: "",
        size: "",
        email: "",
        password: "",
        displayName: "",
        description: "",
        profilePic: null,
        headerPic: null,
      });
    }, 2000);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === currentStep
                    ? "bg-whatsapp text-white"
                    : step < currentStep
                    ? "bg-whatsapp-light text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div 
                  className={`w-12 h-1 ${
                    step < currentStep ? "bg-whatsapp-light" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNextStep}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <Step2WhatsAppConnect
            onNext={handleNextStep}
            onSkip={handleSkipStep}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <Step3ProfileSetup
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        
        <Card className="border shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Create your account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepIndicator()}
            {renderStep()}
          </CardContent>
        </Card>

        {currentStep === 1 && (
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <Link href="/login" className="text-whatsapp hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
