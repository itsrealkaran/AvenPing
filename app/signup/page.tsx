"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Triangle, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "@/components/landing/navbar";

interface SignupData {
  name: string;
  industry: string;
  size: string;
  email: string;
  password: string;
  confirm_password: string;
}

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Other"
];

const customerSizes = [
  "1-50 customers",
  "51-200 customers", 
  "201-1000 customers",
  "1000+ customers"
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<SignupData>({
    name: "",
    industry: "",
    size: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/signup", formData);

      if (response.status === 200) {
        toast.success("Account created successfully!");
        // Move to WhatsApp connection step instead of going directly to dashboard
        setCurrentStep(6);
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipWhatsApp = () => {
    router.push("/dashboard");
  };

  const handleConnectWhatsApp = () => {
    // Redirect to WhatsApp connection flow
    router.push("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What Should We Call You?
              </h1>
              <p className="text-gray-600">Let's Start with your Name</p>
            </div>
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter Your Full Name"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What's your industry?
              </h1>
              <p className="text-gray-600">Help us customize your experience</p>
            </div>
            <div>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData("industry", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900"
                required
              >
                <option value="">Choose Your Industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                How many customers do you serve?
              </h1>
              <p className="text-gray-600">This helps us recommend the right plan</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {customerSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateFormData("size", size)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    formData.size === size
                      ? "border-[#43A2C9] bg-[#43A2C9]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What's your email?
              </h1>
              <p className="text-gray-600">We'll use this to create your account</p>
            </div>
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Enter Your email address"
                required
              />
            </div>
          </div>
        );

             case 5:
         return (
           <div className="space-y-6">
             <div>
               <h1 className="text-2xl font-bold text-gray-900 mb-2">
                 Create a password
               </h1>
               <p className="text-gray-600">Choose a strong password for your account</p>
             </div>
             <div className="space-y-4">
               <div className="relative">
                 <input
                   type={showPassword ? "text" : "password"}
                   value={formData.password}
                   onChange={(e) => updateFormData("password", e.target.value)}
                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                   placeholder="Enter a strong password"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
               <p className="text-xs text-red-500">* Password should be at least 8 characters long</p>
               
               <div className="relative">
                 <input
                   type={showConfirmPassword ? "text" : "password"}
                   value={formData.confirm_password}
                   onChange={(e) => updateFormData("confirm_password", e.target.value)}
                   className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                   placeholder="Confirm your password"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                 >
                   {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
             </div>
           </div>
         );

       case 6:
         return (
           <div className="space-y-6">
             <div className="text-center">
               <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                 <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                 </svg>
               </div>
               <h1 className="text-2xl font-bold text-gray-900 mb-2">
                 Connect your WhatsApp
               </h1>
               <p className="text-gray-600">
                 Connect your WhatsApp Business account to start managing conversations
               </p>
             </div>
             
             <div className="space-y-4">
               <button
                 type="button"
                 onClick={handleConnectWhatsApp}
                 className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
               >
                 Connect to WhatsApp
               </button>
               
               <button
                 type="button"
                 onClick={handleSkipWhatsApp}
                 className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
               >
                 Skip for now
               </button>
             </div>
           </div>
         );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.industry.length > 0;
      case 3:
        return formData.size.length > 0;
      case 4:
        return formData.email.trim().length > 0 && formData.email.includes('@');
      case 5:
        return formData.password.length >= 8 && formData.confirm_password.length >= 8;
      case 6:
        return true; // WhatsApp step doesn't need validation
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DFFFF9] via-white to-[#FDCEFF]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center space-y-1">
        {/* Header */}
        <Navbar />

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black/10 p-6 sm:p-8 w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>

                             {currentStep < 5 ? (
                 <button
                   type="button"
                   onClick={nextStep}
                   disabled={!canProceed()}
                   className="px-6 py-2 bg-[#43A2C9] text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Next
                 </button>
               ) : currentStep === 5 ? (
                 <button
                   type="submit"
                   disabled={!canProceed() || isLoading}
                   className="px-6 py-2 bg-[#43A2C9] text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   {isLoading ? (
                     <div className="flex items-center gap-2">
                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                       Creating account...
                     </div>
                   ) : (
                     "Create Account"
                   )}
                 </button>
               ) : null}
            </div>
          </form>

                     {/* Progress Indicator */}
           <div className="flex items-center justify-center gap-2 mt-6">
             {[1, 2, 3, 4, 5, 6].map((step) => (
               <div
                 key={step}
                 className={`w-2 h-2 rounded-full transition-colors ${
                   step <= currentStep ? "bg-[#43A2C9]" : "bg-gray-300"
                 }`}
               />
             ))}
           </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#43A2C9] hover:text-cyan-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 