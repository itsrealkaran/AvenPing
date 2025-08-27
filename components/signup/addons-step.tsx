"use client";

import React, { useState, useEffect } from "react";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";

interface PriceJson {
  US: number;
  IND: number;
  ASIA: number;
}

interface Addon {
  id: string;
  name: string;
  monthlyPriceJson: PriceJson;
  yearlyPriceJson: PriceJson;
  features: string[];
  isAddOn: boolean;
  isActivated?: boolean;
  isActive?: boolean;
}

interface AddonsStepProps {
  onNext: () => void;
  onBack: () => void;
  onShowPaymentModal: (addon: Addon, period: "month" | "year", region: "US" | "IND" | "ASIA", months: number, quantity: number) => void;
}

export default function AddonsStep({ onNext, onBack, onShowPaymentModal }: AddonsStepProps) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState<"US" | "IND" | "ASIA">("US");
  const [addonPeriods, setAddonPeriods] = useState<{ [key: string]: "month" | "year" }>({});
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [currentPlanLoading, setCurrentPlanLoading] = useState(false);

  // Helper function to get currency symbol based on region
  const getCurrencySymbol = (region: "US" | "IND" | "ASIA") => {
    switch (region) {
      case "US": return "$";
      case "IND": return "₹";
      case "ASIA": return "$";
      default: return "$";
    }
  };

  // Helper function to get plan price based on period and region
  const getPlanPrice = (addon: Addon, period: "month" | "year", region: "US" | "IND" | "ASIA") => {
    const priceJson = period === "month" ? addon.monthlyPriceJson : addon.yearlyPriceJson;
    return priceJson[region];
  };

  // Check if user already has this addon
  const hasAddon = (addonName: string) => {
    if (!currentPlan || !Array.isArray(currentPlan)) return false;
    
    // Check if any plan in the array has this addon name and isAddOn is true
    return currentPlan.some((plan: any) => 
      plan.isAddOn === true && plan.planName === addonName
    );
  };

  // Fetch user's current plan
  const fetchCurrentPlan = async () => {
    try {
      setCurrentPlanLoading(true);
      const response = await fetch('/api/subscription/plans/current', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data.plan);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
    } finally {
      setCurrentPlanLoading(false);
    }
  };

  // Fetch addons from API
  const fetchAddons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/subscription/get-next');
      
      if (!response.ok) {
        throw new Error('Failed to fetch addons');
      }
      
      const data = await response.json();
      
      if (data.addons && Array.isArray(data.addons)) {
        const addonsWithDefaults = data.addons.map((addon: Addon) => ({
          ...addon,
          isActivated: addon.isActive || false,
          isActive: addon.isActive || false
        }));
        
        setAddons(addonsWithDefaults);
        
        // Initialize periods for each addon
        const initialPeriods: { [key: string]: "month" | "year" } = {};
        addonsWithDefaults.forEach((addon: Addon) => {
          initialPeriods[addon.id] = "month";
        });
        setAddonPeriods(initialPeriods);
      } else {
        setAddons([]);
      }
    } catch (error) {
      console.error('Error fetching addons:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle addon selection
  const handleAddonSelection = (addonId: string) => {
    // Don't allow selection if user already has this addon
    if (hasAddon(addonId)) {
      return;
    }
    
    // Allow selecting only one addon at a time
    if (selectedAddons.has(addonId)) {
      // Deselect if the same addon is clicked again
      setSelectedAddons(new Set());
    } else {
      // Select only the clicked addon
      setSelectedAddons(new Set([addonId]));
    }
  };

  // Handle period change for an addon
  const handlePeriodChange = (addonId: string, period: "month" | "year") => {
    setAddonPeriods(prev => ({
      ...prev,
      [addonId]: period
    }));
  };

  // Handle proceeding with selected addons
  const handleProceed = () => {
    if (selectedAddons.size === 0) {
      fetch('/api/auth/signup/complete', {
        method: 'POST',
        credentials: 'include',
      }).then(() => {
        window.location.href = '/dashboard';
      });

      return;
    }

    // Process each selected addon
    const selectedAddonsArray = Array.from(selectedAddons);
    const firstAddon = addons.find(addon => addon.id === selectedAddonsArray[0]);
    
    if (firstAddon) {
      const period = addonPeriods[firstAddon.id] || "year";
      onShowPaymentModal(firstAddon, period, region, 1, 1);
    }
  };

  // Fetch addons and current plan when component mounts
  useEffect(() => {
    fetchAddons();
    fetchCurrentPlan();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[260px] flex flex-col justify-center space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#43A2C9]/20 to-cyan-100 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 border-3 border-[#43A2C9] border-t-transparent rounded-full animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Loading Add-ons</h1>
          <p className="text-gray-600 text-lg">Fetching available add-ons for your plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[260px] flex flex-col justify-center space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Error Loading Add-ons</h1>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <button 
            onClick={fetchAddons}
            className="px-8 py-3 bg-gradient-to-r from-[#43A2C9] to-cyan-500 text-white rounded-lg hover:from-[#43A2C9] hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[260px] flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Enhance Your Plan</h1>
        <p className="text-lg text-gray-600 mb-6">Choose additional features to supercharge your WhatsApp automation</p>
      </div>

      {/* Region Selector */}
      <div className="flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Region:</span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as "US" | "IND" | "ASIA")}
              className="text-sm border-2 border-gray-200 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-[#43A2C9] focus:border-[#43A2C9] transition-all duration-200 font-medium"
            >
              <option value="US">🇺🇸 US</option>
              <option value="IND">🇮🇳 IND</option>
              <option value="ASIA">🌏 ASIA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add-ons Grid */}
      {addons.length === 0 ? (
        <div className="bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm border-2 border-gray-200 rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
              <Plus className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Add-ons Available</h3>
            <p className="text-gray-600 mb-4 text-lg">
              All available add-ons are already included in your selected plan.
            </p>
            <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-500">
                You can always add more features later from your dashboard.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {addons.map((addon) => {
            const price = getPlanPrice(addon, addonPeriods[addon.id] || "month", region);
            const currencySymbol = getCurrencySymbol(region);
            const isSelected = selectedAddons.has(addon.id);
            const period = addonPeriods[addon.id] || "month";
            const alreadyHasAddon = hasAddon(addon.name);
            
            return (
              <div
                key={addon.id}
                className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all duration-300 ${
                  alreadyHasAddon
                    ? "border-green-200 bg-gradient-to-br from-green-50 to-green-100 cursor-not-allowed opacity-75"
                    : isSelected
                    ? "border-[#43A2C9] bg-gradient-to-br from-[#43A2C9]/10 to-[#43A2C9]/5 shadow-xl shadow-[#43A2C9]/20 transform hover:scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-[#43A2C9] hover:shadow-lg hover:shadow-[#43A2C9]/10 hover:bg-gradient-to-br hover:from-[#43A2C9]/5 hover:to-white transform hover:scale-[1.02]"
                }`}
                onClick={() => handleAddonSelection(addon.id)}
              >
                {/* Already Owned Badge */}
                {alreadyHasAddon && (
                  <div className="absolute -top-2 -left-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && !alreadyHasAddon && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#43A2C9] to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Addon Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{addon.name}</h3>
                    {period === "year" && price > 0 && !alreadyHasAddon && (
                      <span className="bg-gradient-to-r from-[#43A2C9] to-cyan-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                        Save with yearly
                      </span>
                    )}
                  </div>
                  
                  {/* Price Display */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {price === 0 ? "Free" : currencySymbol}
                      </span>
                      {price > 0 && (
                        <span className="text-2xl font-bold text-[#43A2C9]">
                          {price}
                        </span>
                      )}
                      <span className="text-lg font-medium text-gray-600">
                        /{period}
                      </span>
                    </div>
                    {price > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Billed {period === "month" ? "monthly" : "annually"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                {/* <div className="space-y-3 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                    What's included:
                  </h4>
                  {addon.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-[#43A2C9] to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                  {addon.features.length > 3 && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm text-[#43A2C9] font-medium">
                        <div className="w-4 h-4 bg-[#43A2C9] rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">+</span>
                        </div>
                        <span>{addon.features.length - 3} more features</span>
                      </div>
                    </div>
                  )}
                </div> */}

                {/* Status Message */}
                {alreadyHasAddon && (
                  <div className="text-center py-3 bg-green-100 text-green-700 rounded-lg">
                    <span className="text-sm font-medium">
                      ✓ You already own this addon
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selection Summary */}
      {selectedAddons.size > 0 && (
        <div className="bg-gradient-to-r from-[#43A2C9]/10 to-cyan-50 backdrop-blur-sm border-2 border-[#43A2C9] rounded-xl p-6 shadow-lg shadow-[#43A2C9]/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#43A2C9] to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-[#43A2C9]">
                Add-ons Selected!
              </h3>
            </div>
            
            <div className="bg-white/80 rounded-xl p-4 mb-4 border border-[#43A2C9]/20">
              <div className="text-sm text-gray-600 mb-3 font-medium">
                {selectedAddons.size} add-on{selectedAddons.size > 1 ? 's' : ''} selected
              </div>
              <div className="space-y-2">
                {Array.from(selectedAddons).map(addonId => {
                  const addon = addons.find(a => a.id === addonId);
                  const period = addonPeriods[addonId] || "year";
                  const price = addon ? getPlanPrice(addon, period, region) : 0;
                  const currencySymbol = getCurrencySymbol(region);
                  
                  return addon ? (
                    <div key={addonId} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#43A2C9] rounded-full"></div>
                        <span className="text-sm font-medium text-gray-800">{addon.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 capitalize">{period}</span>
                        <div className="text-sm font-bold text-[#43A2C9]">
                          {currencySymbol}{price}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center mt-8">
        <button
          type="button"
          onClick={handleProceed}
          className="px-8 py-3 bg-gradient-to-r from-[#43A2C9] to-cyan-500 text-white rounded-xl hover:from-[#43A2C9] hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
        >
          {selectedAddons.size > 0 ? "Proceed with Add-ons" : "Complete Signup"}
        </button>
      </div>
    </div>
  );
}