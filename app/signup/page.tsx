"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import Navbar from "@/components/landing/navbar";
import SearchableDropdown from "@/components/landing/ui/searchable-dropdown";
import PaymentStep from "@/components/signup/payment-step";
import PaymentGatewayModal from "@/components/settings/payment-gateway-modal";
import AddonsStep from "@/components/signup/addons-step";
import AddonModal from "@/components/settings/addon-modal";

// Facebook SDK types
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

interface SignupData {
  name: string;
  industry: string;
  size: string;
  email: string;
  password: string;
  confirm_password: string;
}

const industries = [
  { id: "1", label: "Technology", value: "Technology" },
  { id: "2", label: "Healthcare", value: "Healthcare" },
  { id: "3", label: "Finance", value: "Finance" },
  { id: "4", label: "Education", value: "Education" },
  { id: "5", label: "Retail", value: "Retail" },
  { id: "6", label: "Manufacturing", value: "Manufacturing" },
  { id: "7", label: "Real Estate", value: "Real Estate" },
  { id: "8", label: "Marketing", value: "Marketing" },
  { id: "9", label: "Consulting", value: "Consulting" },
  { id: "10", label: "Other", value: "Other" },
];

const customerSizes = [
  "1-50 customers",
  "51-200 customers",
  "201-1000 customers",
  "1000+ customers",
];

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectingWhatsApp, setIsConnectingWhatsApp] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState<{
    isConnected: boolean;
    isLoading: boolean;
    error: string | null;
  }>({
    isConnected: false,
    isLoading: true,
    error: null
  });
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [planPeriodForPayment, setPlanPeriodForPayment] = useState<"month" | "year">("year");
  const [regionForPayment, setRegionForPayment] = useState<"US" | "IND" | "ASIA">("US");
  const [monthsForPayment, setMonthsForPayment] = useState(1);
  const [quantityForPayment, setQuantityForPayment] = useState(1);
  const [isAddonPayment, setIsAddonPayment] = useState(false);
  
  // Addon modal state
  const [showAddonModal, setShowAddonModal] = useState(false);
  const [selectedAddonForModal, setSelectedAddonForModal] = useState<any>(null);
  const [addonMonths, setAddonMonths] = useState(1);
  const [addonQuantity, setAddonQuantity] = useState(1);
  const [addonRegion, setAddonRegion] = useState<"US" | "IND" | "ASIA">("US");
  
  const router = useRouter();



  const [formData, setFormData] = useState<SignupData>({
    name: "",
    industry: "",
    size: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [selectedIndustry, setSelectedIndustry] = useState<{
    id: string;
    label: string;
    value: string;
  } | null>(null);

  // get the status from the url 
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const isAddon = searchParams.get("isAddon");

  useEffect(() => {
    if (isAddon === "true" && status === "paid") {
      setCurrentStep(8);
    } else if (status === "registered") {
      setCurrentStep(6);
    } else if (status === "paid") {
      setCurrentStep(7);
    }
  }, [status, isAddon]);

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 7) {
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

    setCurrentStep(6);

    try {
      setIsLoading(true);
      const response = await axios.post("/api/auth/signup", formData);

      if (response.status === 200) {
        toast.success("Account created successfully!");
        // Move to plan selection step
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
    setCurrentStep(8);
  };

  const handleShowPaymentModal = (plan: any, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    setSelectedPlanForPayment(plan);
    setPlanPeriodForPayment(period);
    setRegionForPayment(region);
    setShowPaymentModal(true);
  };

  const handleShowAddonPaymentModal = (addon: any, period: "month" | "year", region: "US" | "IND" | "ASIA", months: number, quantity: number) => {
    setSelectedAddonForModal(addon);
    setAddonMonths(months);
    setAddonQuantity(quantity);
    setAddonRegion(region);
    setShowAddonModal(true);
  };

  // Handle proceeding from addon modal to payment
  const handleProceedToPayment = (addon: any, months: number, quantity: number) => {
    setShowAddonModal(false);
    
    // Now open the payment gateway modal
    setSelectedPlanForPayment(addon);
    setPlanPeriodForPayment("month"); // Addons are always monthly
    setRegionForPayment(addonRegion);
    setMonthsForPayment(months);
    setQuantityForPayment(quantity);
    setIsAddonPayment(true);
    setShowPaymentModal(true);
  };

  const checkWhatsAppStatus = async () => {
    try {
      setWhatsappStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await fetch('/api/get-info', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const isConnected = data.userData?.whatsappAccount?.phoneNumbers?.length > 0;
        
        setWhatsappStatus({
          isConnected,
          isLoading: false,
          error: null
        });
      } else {
        throw new Error('Failed to fetch WhatsApp status');
      }
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
      setWhatsappStatus({
        isConnected: false,
        isLoading: false,
        error: 'Failed to check WhatsApp status'
      });
    }
  };

  const getPlanPrice = (plan: any, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    if (!plan) return 0;
    const priceJson = period === "month" ? plan.monthlyPriceJson : plan.yearlyPriceJson;
    const basePrice = priceJson?.[region] || 0;
    
    // For addons, multiply by months and quantity
    if (isAddonPayment) {
      return basePrice * monthsForPayment * quantityForPayment;
    }
    
    return basePrice;
  };

  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    switch (region) {
      case "US": return "$";
      case "IND": return "₹";
      case "ASIA": return "$";
      default: return "$";
    }
  };

  // Check for payment success from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('success');
    const paymentCanceled = urlParams.get('canceled');
    
    if (paymentSuccess === 'true') {
      setCurrentStep(6);
    } else if (paymentCanceled === 'true') {
      toast.error('Payment was canceled. Please try again.');
    }
  }, []);

  // Check WhatsApp status when reaching step 7
  useEffect(() => {
    if (currentStep === 7) {
      checkWhatsAppStatus();
    }
  }, [currentStep]);

  const handleConnectWhatsApp = async () => {
    setIsConnectingWhatsApp(true);

    //@ts-expect-error - Facebook SDK
    FB.login(
      (response: any) => {
        if (response.authResponse) {
          console.log("Logged in as:", response.authResponse);
          //@ts-expect-error - Facebook SDK
          FB.api("/me", { fields: "name, email" }, (userInfo) => {
            console.log(
              "Logged in as:",
              userInfo.name,
              "Email:",
              userInfo.email
            );
          });

          axios
            .post("/api/whatsapp", {
              code: response.authResponse.code,
            })
            .then((res) => {
              console.log(res.data);
              toast.success("WhatsApp connected successfully!");
              router.push("/dashboard");
            })
            .catch((error) => {
              console.error("Error connecting WhatsApp:", error);
              toast.error("Failed to connect WhatsApp. Please try again.");
              setIsConnectingWhatsApp(false);
            });
        } else {
          console.log("User cancelled login or did not fully authorize.");
          toast.error("WhatsApp connection was cancelled.");
          setIsConnectingWhatsApp(false);
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_META_CONFIG_ID,
        response_type: "code",
        override_default_response_type: true,
        scope:
          "whatsapp_business_management,whatsapp_business_messaging,business_management",
      }
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="min-h-[260px] flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What Should We Call You?
              </h1>
              <p className="text-gray-600">Let&apos;s Start with your Name</p>
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
          <div className="min-h-[260px] flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What&apos;s your industry?
              </h1>
              <p className="text-gray-600">Help us customize your experience</p>
            </div>
            <div>
              <SearchableDropdown
                items={industries}
                placeholder="Choose Your Industry"
                onSelect={(item) => {
                  setSelectedIndustry(item);
                  updateFormData("industry", item.value);
                }}
                variant="outline"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900"
                selectedLabel={selectedIndustry?.label || null}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="min-h-[260px] flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                How many customers do you serve?
              </h1>
              <p className="text-gray-600">
                This helps us recommend the right plan
              </p>
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
          <div className="min-h-[260px] flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                What&apos;s your email?
              </h1>
              <p className="text-gray-600">
                We&apos;ll use this to create your account
              </p>
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
          <div className="min-h-[260px] flex flex-col space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create a password
              </h1>
              <p className="text-gray-600">
                Choose a strong password for your account
              </p>
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
              <p className="text-xs text-red-500">
                * Password should be at least 8 characters long
              </p>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirm_password}
                  onChange={(e) =>
                    updateFormData("confirm_password", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <PaymentStep 
            onNext={nextStep}
            onBack={prevStep}
            onShowPaymentModal={handleShowPaymentModal}
            isAddon={searchParams.get("isAddon") === "true"}
          />
        );

      case 7:
        return (
          <div className="min-h-[260px] flex flex-col justify-center space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {whatsappStatus.isLoading 
                  ? "Checking WhatsApp status..." 
                  : whatsappStatus.isConnected 
                    ? "WhatsApp Already Connected!" 
                    : "Connect your WhatsApp"
                }
              </h1>
              
              {whatsappStatus.isConnected && (
                <p className="text-gray-600">
                  Great! Your WhatsApp is already connected. You can proceed to the dashboard.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={handleConnectWhatsApp}
                disabled={isConnectingWhatsApp}
                className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnectingWhatsApp ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  "Connect to WhatsApp"
                )}
              </button>

              <button
                type="button"
                onClick={handleSkipWhatsApp}
                disabled={isConnectingWhatsApp}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {whatsappStatus.isConnected ? "Go to Dashboard" : "Skip for now"}
              </button>
            </div>
          </div>
        );

        case 8:
          return (
            <AddonsStep 
              onNext={nextStep}
              onBack={prevStep}
              onShowPaymentModal={handleShowAddonPaymentModal}
            />
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
        return formData.email.trim().length > 0 && formData.email.includes("@");
      case 5:
        return (
          formData.password.length >= 8 && formData.confirm_password.length >= 8
        );
      case 6:
        return true; // Payment step is handled by the PaymentStep component
      case 7:
        return true; // WhatsApp connection step
      case 8:
        return true; // Addons step is handled by the AddonsStep component
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
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black/10 p-6 sm:p-8 w-full max-h-[70vh] max-w-lg overflow-y-auto">
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
             {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
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
            <Link
              href="/login"
              className="text-[#43A2C9] hover:text-cyan-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGatewayModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planName={selectedPlanForPayment?.name || ""}
        planPeriod={planPeriodForPayment}
        region={regionForPayment}
        price={getPlanPrice(selectedPlanForPayment, planPeriodForPayment, regionForPayment)}
        currency={getCurrencySymbol(regionForPayment)}
        isAddon={isAddonPayment}
        months={monthsForPayment}
        quantity={quantityForPayment}
        isFromSignup={true}
      />

      {/* Addon Modal */}
      {selectedAddonForModal && (
        <AddonModal
          isOpen={showAddonModal}
          onClose={() => setShowAddonModal(false)}
          addon={selectedAddonForModal}
          months={addonMonths}
          onMonthsChange={setAddonMonths}
          region={addonRegion}
          quantity={addonQuantity}
          onQuantityChange={setAddonQuantity}
          onProceedToPayment={handleProceedToPayment}
          isFromSignup={true}
        />
      )}
    </div>
  );
}
