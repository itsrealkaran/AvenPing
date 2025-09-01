"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUserRegionCached,
  getRegionConfig,
  type Region,
} from "@/lib/region";

interface PriceJson {
  US: number;
  IND: number;
  ASIA: number;
}

interface Plan {
  id: string;
  name: string;
  monthlyPriceJson: PriceJson;
  yearlyPriceJson: PriceJson;
  features: string[];
  isAddOn: boolean;
}

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  onShowPaymentModal: (
    plan: Plan,
    period: "month" | "year",
    region: "US" | "IND" | "ASIA"
  ) => void;
  isAddon?: boolean;
}

export default function PaymentStep({
  onNext,
  onBack,
  onShowPaymentModal,
  isAddon = false,
}: PaymentStepProps) {
  // Plan selection state
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>({
    id: "free-trial",
    name: "Free Trial",
    monthlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
    yearlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
    features: [],
    isAddOn: false,
  });
  const [isYearly, setIsYearly] = useState(true);
  const [region, setRegion] = useState<"US" | "IND" | "ASIA">("US");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isFreeTrialLoading, setIsFreeTrialLoading] = useState(false);
  const [regionLoading, setRegionLoading] = useState(true);

  // Helper function to get currency symbol using region config
  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    const config = getRegionConfig(region);
    switch (config.currency) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      default:
        return "$";
    }
  };

  // Helper function to get plan price
  const getPlanPrice = (
    plan: Plan,
    isYearly: boolean,
    region: "US" | "IND" | "ASIA"
  ) => {
    const priceJson = isYearly ? plan.yearlyPriceJson : plan.monthlyPriceJson;
    return priceJson[region];
  };

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      setPlansError(null);

      const response = await fetch("/api/subscription/plans");

      if (!response.ok) {
        throw new Error("Failed to fetch plans");
      }

      const data = await response.json();

      if (data.success) {
        setPlans(data.plans);
      } else {
        throw new Error(data.error || "Failed to fetch plans");
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlansError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setPlansLoading(false);
    }
  };

  const handlePlanSelection = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan to continue");
      return;
    }

    // Handle free trial selection
    if (selectedPlan.id === "free-trial") {
      try {
        setIsFreeTrialLoading(true);

        const response = await fetch("/api/subscription/free-trial", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.success) {
            toast.success(
              "Free trial activated successfully! Redirecting to dashboard..."
            );
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } else {
            toast.error(data.error || "Failed to activate free trial");
          }
        } else {
          const errorData = await response.json();
          if (errorData.error === "Free trial already redeemed") {
            toast.error(
              "You have already used your free trial. Please select a paid plan."
            );
          } else {
            toast.error(errorData.error || "Failed to activate free trial");
          }
        }
      } catch (error) {
        console.error("Error activating free trial:", error);
        toast.error("An error occurred while activating free trial");
      } finally {
        setIsFreeTrialLoading(false);
      }
      return;
    }

    // Handle paid plan selection
    onShowPaymentModal(selectedPlan, isYearly ? "year" : "month", region);
  };

  // Handle free trial selection
  const handleFreeTrial = async () => {
    try {
      setIsFreeTrialLoading(true);

      const response = await fetch("/api/subscription/free-trial", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          toast.success(
            "Free trial activated successfully! Redirecting to dashboard..."
          );
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          toast.error(data.error || "Failed to activate free trial");
        }
      } else {
        const errorData = await response.json();
        if (errorData.error === "Free trial already redeemed") {
          toast.error(
            "You have already used your free trial. Please select a paid plan."
          );
        } else {
          toast.error(errorData.error || "Failed to activate free trial");
        }
      }
    } catch (error) {
      console.error("Error activating free trial:", error);
      toast.error("An error occurred while activating free trial");
    } finally {
      setIsFreeTrialLoading(false);
    }
  };

  // Check for payment success from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("success");
    const paymentCanceled = urlParams.get("canceled");

    if (paymentSuccess === "true") {
      // Start polling for payment confirmation
      pollPaymentStatus();
    } else if (paymentCanceled === "true") {
      toast.error("Payment was canceled. Please try again.");
      // Clear the URL parameters
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Remove onNext dependency to run on every mount/URL change

  // Also check URL parameters on every render to catch redirects
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get("success");
      const paymentCanceled = urlParams.get("canceled");

      if (paymentSuccess === "true" && !isCheckingPayment) {
        pollPaymentStatus();
      }
    };

    // Check immediately
    checkUrlParams();

    // Also check after a short delay to catch any late URL updates
    const timeoutId = setTimeout(checkUrlParams, 100);

    return () => clearTimeout(timeoutId);
  }, [isCheckingPayment]); // Run when isCheckingPayment changes

  // Poll payment status API
  const pollPaymentStatus = async () => {
    setIsCheckingPayment(true);
    const maxAttempts = 30; // 30 attempts
    const intervalMs = 2000; // 2 seconds between attempts
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch("/api/auth/check-signup-status", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();

          if (data.signupStatus === "PAID") {
            // Payment confirmed, update session and proceed
            setIsCheckingPayment(false);
            toast.success("Payment confirmed! Proceeding to next step...");
            // Check if this is an addon payment
            const urlParams = new URLSearchParams(window.location.search);
            const isAddonPayment =
              urlParams.get("isAddon") === "true" || isAddon;

            if (isAddonPayment) {
              // For addon payments, navigate to addons step (step 8)
              // We need to use window.location to ensure proper navigation
              window.location.href = "/signup?status=paid&isAddon=true";
            } else {
              // For regular plan payments, proceed to WhatsApp connection (step 7)
              onNext();
            }
            return;
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }

      attempts++;

      if (attempts < maxAttempts) {
        // Continue polling
        setTimeout(poll, intervalMs);
      } else {
        // Max attempts reached, show error
        setIsCheckingPayment(false);
        toast.error("Payment verification timeout. Please contact support.");
      }
    };

    // Start polling
    poll();
  };

  // Detect user region on component mount
  useEffect(() => {
    const detectUserRegion = async () => {
      try {
        setRegionLoading(true);
        const detectedRegion = await getUserRegionCached();
        setRegion(detectedRegion);
        const config = getRegionConfig(detectedRegion);
        console.log(
          "Detected user region:",
          detectedRegion,
          "with config:",
          config
        );
      } catch (error) {
        console.warn(
          "Failed to detect user region, using default (US):",
          error
        );
        setRegion("US");
      } finally {
        setRegionLoading(false);
      }
    };

    detectUserRegion();
  }, []);

  // Fetch plans when component mounts
  useEffect(() => {
    if (plans.length === 0) {
      fetchPlans();
    }
  }, [plans.length]);

  const canProceed = () => {
    return selectedPlan !== null && !plansLoading && plans.length > 0;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600">
          Select the perfect plan for your Business
        </p>
      </div>

      {/* Billing Toggle */}
      {/* <div className="flex items-center justify-center gap-4 mb-8">
        <span
          className={`text-sm font-medium ${
            !isYearly ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsYearly(!isYearly);
          }}
          type="button"
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isYearly ? "bg-[#43A2C9]" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              isYearly ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${
            isYearly ? "text-gray-900" : "text-gray-500"
          }`}
        >
          Annual
        </span>
      </div> */}

      {/* Plans Grid */}
      {plansLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="cursor-pointer border-3 border-[#E0E0E0] rounded-2xl p-3.5 flex flex-col animate-pulse"
            >
              <span className="text-sm text-gray-700 animate-pulse">
                Plan {i}
              </span>
              <div className="flex flex-1 justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-300 text-gray-800 mt-1 animate-pulse">
                    {`00`}
                    <span className="text-lg font-medium text-gray-600">
                      /month
                    </span>
                  </span>

                  <div className="flex items-center gap-1 mt-1 text-xs">
                    <span className="font-semibold animate-pulse">
                      Billed annually
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : plansError ? (
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Error Loading Plans
            </h3>
            <p className="text-xs text-red-700 mb-3">{plansError}</p>
            <button
              onClick={fetchPlans}
              className="px-4 py-2 bg-[#43A2C9] hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-gray-600">No plans available at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {/* Free Trial Card */}
          <div
            onClick={() =>
              setSelectedPlan({
                id: "free-trial",
                name: "Free Trial",
                monthlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
                yearlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
                features: [],
                isAddOn: false,
              })
            }
            className={`cursor-pointer border-3 border-[#E0E0E0] rounded-2xl p-3.5 flex flex-col ${
              selectedPlan?.id === "free-trial"
                ? "border-green-500 bg-green-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md hover:bg-green-50"
            }`}
          >
            <span className="text-sm text-gray-700">Free Trial</span>
            <div className="flex justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-2xl font-300 text-gray-800 mt-2">
                  Free
                </span>
                <div className={`flex items-center gap-1 mt-2 text-xs`}>
                  <span className="font-semibold">
                    Explore features risk-free!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {plans.map((plan) => {
            const price = getPlanPrice(plan, isYearly, region);
            const currencySymbol = getCurrencySymbol(region);
            const isSelected = selectedPlan?.id === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer border-3 rounded-2xl p-3.5 flex flex-col ${
                  isSelected
                    ? "border-[#43A2C9] bg-[#43A2C9]/5 shadow-lg"
                    : "border-gray-200 bg-white hover:border-[#43A2C9] hover:shadow-md hover:bg-[#43A2C9]/5"
                }`}
              >
                <span className="text-sm text-gray-700">{plan.name}</span>
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-300 text-gray-800 mt-1">
                      {price === 0 ? "Free" : `${currencySymbol}${price}`}
                      <span className="text-lg font-medium text-gray-600">
                        /month
                      </span>
                    </span>
                    <div className={`flex items-center gap-1 mt-1 text-xs`}>
                      <span className="font-semibold">
                        {price === 0
                          ? "Explore features risk-free!"
                          : isYearly
                          ? "Billed annually"
                          : "Billed monthly"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        // <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl mx-auto">
        //   {/* Free Trial Card */}
        //   <div
        //     onClick={() =>
        //       setSelectedPlan({
        //         id: "free-trial",
        //         name: "Free Trial",
        //         monthlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
        //         yearlyPriceJson: { US: 0, IND: 0, ASIA: 0 },
        //         features: [],
        //         isAddOn: false,
        //       })
        //     }
        //     className={`cursor-pointer border-3 border-[#E0E0E0] rounded-2xl p-4 flex flex-col ${
        //       selectedPlan?.id === "free-trial"
        //         ? "border-green-500 bg-green-50 shadow-lg"
        //         : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md hover:bg-green-50"
        //     }`}
        //   >
        //     <div className="flex justify-between gap-4">
        //       <div className="flex flex-col">
        //         <div className="flex justify-between items-center">
        //           <span className="text-sm text-gray-700">Free Trial</span>
        //           <span className="text-xl font-300 text-gray-800">Free</span>
        //         </div>
        //         <div className={`flex items-center gap-1 mt-2 text-xs`}>
        //           <span className="font-semibold">
        //             Explore features risk-free!
        //           </span>
        //         </div>
        //       </div>
        //     </div>
        //   </div>

        //   {plans.map((plan) => {
        //     const price = getPlanPrice(plan, isYearly, region);
        //     const currencySymbol = getCurrencySymbol(region);
        //     const isSelected = selectedPlan?.id === plan.id;

        //     return (
        //       <div
        //         key={plan.id}
        //         onClick={() => setSelectedPlan(plan)}
        //         className={`cursor-pointer border-3 rounded-2xl p-4 flex flex-col ${
        //           isSelected
        //             ? "border-[#43A2C9] bg-[#43A2C9]/5 shadow-lg"
        //             : "border-gray-200 bg-white hover:border-[#43A2C9] hover:shadow-md hover:bg-[#43A2C9]/5"
        //         }`}
        //       >
        //         <div className="flex justify-between gap-4">
        //           <div className="flex flex-1 flex-col">
        //             <div className="flex justify-between items-center">
        //               <span className="text-sm text-gray-700">{plan.name}</span>
        //               <span className="text-xl font-300 text-gray-800">
        //                 {price === 0 ? "Free" : `${currencySymbol}${price}/m.`}
        //               </span>
        //             </div>
        //             <div className={`flex items-center gap-1 mt-2 text-xs`}>
        //               <span className="font-semibold">
        //                 {price === 0
        //                   ? "Explore features risk-free!"
        //                   : isYearly
        //                   ? "Billed annually"
        //                   : "Billed monthly"}
        //               </span>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     );
        //   })}
        // </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-around items-center">
        <div className="flex items-center justify-center gap-4">
          <span
            className={`text-sm font-medium ${
              !isYearly ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsYearly(!isYearly);
            }}
            type="button"
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isYearly ? "bg-[#43A2C9]" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                isYearly ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${
              isYearly ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Annual
          </span>
        </div>
        <button
          type="button"
          onClick={handlePlanSelection}
          disabled={!canProceed() || isFreeTrialLoading}
          className="px-6 py-2 bg-[#43A2C9] text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isFreeTrialLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Activating Free Trial...
            </div>
          ) : plansLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : selectedPlan?.id === "free-trial" ? (
            "Start Free Trial"
          ) : (
            `Proceed to Pay`
          )}
        </button>
      </div>
    </div>
  );
}
