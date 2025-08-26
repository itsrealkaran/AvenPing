"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

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
  onShowPaymentModal: (plan: Plan, period: "month" | "year", region: "US" | "IND" | "ASIA") => void;
}

export default function PaymentStep({ onNext, onBack, onShowPaymentModal }: PaymentStepProps) {
  // Plan selection state
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planPeriod, setPlanPeriod] = useState<"month" | "year">("year");
  const [region, setRegion] = useState<"US" | "IND" | "ASIA">("US");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);

  // Helper function to get currency symbol
  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    switch (region) {
      case "US": return "$";
      case "IND": return "₹";
      case "ASIA": return "$";
      default: return "$";
    }
  };

  // Helper function to get plan price
  const getPlanPrice = (plan: Plan, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    const priceJson = period === "month" ? plan.monthlyPriceJson : plan.yearlyPriceJson;
    return priceJson[region];
  };

  // Fetch plans from API
  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      setPlansError(null);
      
      const response = await fetch('/api/subscription/plans');
      
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPlans(data.plans);
      } else {
        throw new Error(data.error || 'Failed to fetch plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlansError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setPlansLoading(false);
    }
  };

  const handlePlanSelection = () => {
    if (selectedPlan) {
      // Call parent function to show payment gateway modal
      onShowPaymentModal(selectedPlan, planPeriod, region);
    } else {
      toast.error("Please select a plan to continue");
    }
  };

  // Check for payment success from URL parameters
  useEffect(() => {
    console.log("useEffect from payment-step");
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('success');
    const paymentCanceled = urlParams.get('canceled');

    console.log(paymentSuccess, paymentCanceled, "paymentSuccess, paymentCanceled");
    
    if (paymentSuccess === 'true') {
      // Start polling for payment confirmation
      pollPaymentStatus();
    } else if (paymentCanceled === 'true') {
      toast.error('Payment was canceled. Please try again.');
      // Clear the URL parameters
      // window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []); // Remove onNext dependency to run on every mount/URL change

  // Also check URL parameters on every render to catch redirects
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentSuccess = urlParams.get('success');
      const paymentCanceled = urlParams.get('canceled');

      console.log("Checking URL params on render:", paymentSuccess, paymentCanceled);
      
      if (paymentSuccess === 'true' && !isCheckingPayment) {
        console.log("Payment success detected on render, starting polling...");
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
        const response = await fetch('/api/auth/check-signup-status', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.signupStatus === 'PAID') {
            // Payment confirmed, update session and proceed
            setIsCheckingPayment(false);
            toast.success('Payment confirmed! Proceeding to WhatsApp connection...');
            // window.history.replaceState({}, document.title, window.location.pathname);
            onNext();
            return;
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }

      attempts++;
      
      if (attempts < maxAttempts) {
        // Continue polling
        setTimeout(poll, intervalMs);
      } else {
        // Max attempts reached, show error
        setIsCheckingPayment(false);
        toast.error('Payment verification timeout. Please contact support.');
        // window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // Start polling
    poll();
  };

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
    <div className="min-h-[260px] flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
        <p className="text-gray-600">Select the perfect plan for your WhatsApp automation needs</p>
      </div>

      {/* Region, Billing Period, and Payment Method Selector */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Region:</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as "US" | "IND" | "ASIA")}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent"
          >
            <option value="US">US</option>
            <option value="IND">IND</option>
            <option value="ASIA">ASIA</option>
          </select>
        </div>
        
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
          <button
            onClick={() => setPlanPeriod("month")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              planPeriod === "month" 
                ? "bg-[#43A2C9] text-white" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlanPeriod("year")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              planPeriod === "year" 
                ? "bg-[#43A2C9] text-white" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      {plansLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#43A2C9] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plans...</p>
          </div>
        </div>
      ) : plansError ? (
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-red-800 mb-1">Error Loading Plans</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {plans.map((plan) => {
            const price = getPlanPrice(plan, planPeriod, region);
            const currencySymbol = getCurrencySymbol(region);
            const isSelected = selectedPlan?.id === plan.id;
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[#43A2C9] bg-[#43A2C9]/5 shadow-lg"
                    : "border-gray-200 bg-white hover:border-[#43A2C9] hover:shadow-md hover:bg-[#43A2C9]/5"
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-5 h-5 bg-[#43A2C9] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Plan Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {price === 0 ? "Free" : `${currencySymbol}${price}`}
                      <span className="text-lg font-normal text-gray-500">/{planPeriod}</span>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-[#43A2C9] rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-sm text-[#43A2C9] font-medium">
                          +{plan.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Yearly Savings Badge */}
                {planPeriod === "year" && price > 0 && (
                  <div className="">
                    <span className="bg-[#43A2C9] text-white text-xs font-medium px-2 py-1 rounded-full">
                      Save with yearly
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Plan Summary */}
      {selectedPlan && (
        <div className="bg-white/80 backdrop-blur-sm border border-[#43A2C9] rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <h3 className="text-base font-semibold text-[#43A2C9] mb-2">
              Plan Selected! 🎉
            </h3>
            <div className="bg-white/60 rounded-lg p-3 mb-3">
              <div className="text-lg font-bold text-gray-900 mb-1">
                {selectedPlan.name}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {planPeriod === "month" ? "Monthly" : "Yearly"} billing • {region} region
              </div>
              <div className="text-xl font-bold text-[#43A2C9]">
                {getCurrencySymbol(region)}
                {getPlanPrice(selectedPlan, planPeriod, region)}
                <span className="text-sm font-normal text-gray-500">/{planPeriod}</span>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                {region === 'IND' ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    <span>💳</span>
                    Razorpay
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    <span>💳</span>
                    Stripe
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600">
                Choose your preferred payment method to complete your subscription.
              </p>
            </div>
            
            {isCheckingPayment ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#43A2C9] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-[#43A2C9] font-medium">Verifying payment...</span>
              </div>
            ) : (
              <p className="text-xs text-[#43A2C9] font-medium">
                Ready to choose payment method
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={handlePlanSelection}
          disabled={!canProceed()}
          className="px-6 py-2 bg-[#43A2C9] text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {plansLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : (
            "Choose Payment Method"
          )}
        </button>
      </div>


    </div>
  );
}
