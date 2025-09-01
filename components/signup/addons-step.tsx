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

interface Addon {
  id: string;
  name: string;
  monthlyPriceJson: string;
  yearlyPriceJson: string;
  features: string[];
  isAddOn: boolean;
  isActivated?: boolean;
  isActive?: boolean;
  quantity?: number | null;
}

interface AddonsStepProps {
  onNext: () => void;
  onShowPaymentModal: (
    addon: Addon,
    months: number,
    quantity: number,
    period: "month" | "year",
    region: "US" | "IND" | "ASIA"
  ) => void;
}

export default function AddonsStep({
  onNext,
  onShowPaymentModal,
}: AddonsStepProps) {
  // Addon selection state
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [region, setRegion] = useState<"US" | "IND" | "ASIA">("US");
  const [addons, setAddons] = useState<Addon[]>([]);
  const [addonsLoading, setAddonsLoading] = useState(false);
  const [addonsError, setAddonsError] = useState<string | null>(null);
  const [regionLoading, setRegionLoading] = useState(true);

  // Addon periods state
  const [addonPeriods, setAddonPeriods] = useState<{
    [key: string]: "month" | "year";
  }>({});

  // Addon quantities state
  const [addonQuantities, setAddonQuantities] = useState<{
    [key: string]: number;
  }>({});

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

  // Helper function to get addon price
  const getAddonPrice = (
    addon: Addon,
    isYearly: boolean,
    region: "US" | "IND" | "ASIA"
  ) => {
    try {
      const priceJsonString = isYearly
        ? addon.yearlyPriceJson
        : addon.monthlyPriceJson;
      const priceJson: PriceJson = JSON.parse(priceJsonString);
      return priceJson[region];
    } catch (error) {
      console.error("Error parsing price JSON:", error);
      return 0;
    }
  };

  // Fetch addons from API
  const fetchAddons = async () => {
    try {
      setAddonsLoading(true);
      setAddonsError(null);

      const response = await fetch("/api/subscription/get-next");

      if (!response.ok) {
        throw new Error("Failed to fetch addons");
      }

      const data = await response.json();

      if (data.addons && Array.isArray(data.addons)) {
        const addonsWithDefaults = data.addons.map((addon: any) => ({
          ...addon,
          isActivated: addon.isActive || false,
          isActive: addon.isActive || false,
          // Ensure quantity is set properly
          quantity: addon.quantity || null,
        }));

        setAddons(addonsWithDefaults);

        // Initialize periods and quantities for each addon
        const initialPeriods: { [key: string]: "month" | "year" } = {};
        const initialQuantities: { [key: string]: number } = {};
        addonsWithDefaults.forEach((addon: Addon) => {
          initialPeriods[addon.id] = "month";
          initialQuantities[addon.id] = 1; // Default quantity is 1
        });
        setAddonPeriods(initialPeriods);
        setAddonQuantities(initialQuantities);
      } else {
        setAddons([]);
      }
    } catch (error) {
      console.error("Error fetching addons:", error);
      setAddonsError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setAddonsLoading(false);
    }
  };

  const handleAddonSelection = (addon: Addon) => {
    setSelectedAddons((prev) => {
      const isSelected = prev.some((a) => a.id === addon.id);
      if (isSelected) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddonPeriodChange = (
    addonId: string,
    period: "month" | "year"
  ) => {
    setAddonPeriods((prev) => ({
      ...prev,
      [addonId]: period,
    }));
  };

  const handleAddonQuantityChange = (addonId: string, quantity: number) => {
    setAddonQuantities((prev) => ({
      ...prev,
      [addonId]: Math.max(1, quantity), // Ensure minimum quantity of 1
    }));
  };

  const handleProceedToPayment = () => {
    if (selectedAddons.length === 0) {
      toast.error("Please select at least one addon to continue");
      return;
    }

    // Process each selected addon for payment
    selectedAddons.forEach((addon) => {
      const addonPeriod = addonPeriods[addon.id] || "month";
      const quantity = addonQuantities[addon.id] || 1;

      onShowPaymentModal(addon, 1, quantity, addonPeriod, region);
    });

    // Proceed to next step after payment processing
    onNext();
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

  // Fetch addons when component mounts
  useEffect(() => {
    if (addons.length === 0) {
      fetchAddons();
    }
  }, [addons.length]);

  const canProceed = () => {
    return !addonsLoading && addons.length > 0;
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Addons</h1>
        <p className="text-gray-600">
          Enhance your experience with these powerful addons
        </p>
      </div>

      {/* Addons Grid */}
      {addonsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border-3 rounded-2xl p-3 flex flex-col border-gray-200"
            >
              {/* Addon selection checkbox */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">
                    Addon {i}
                  </span>
                </div>
              </div>

              {/* Quantity selector for selected addons */}
              <div className="flex items-center gap-2 bg-[#43A2C9]/5 opacity-50">
                <span className="text-xs font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentQty = addonQuantities[i] || 1;
                      handleAddonQuantityChange(i.toString(), currentQty - 1);
                    }}
                    disabled={true}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                    {addonQuantities[i] || 1}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentQty = addonQuantities[i] || 1;
                      handleAddonQuantityChange(i.toString(), currentQty + 1);
                    }}
                    disabled={true}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-300 text-gray-800">
                    00
                    <span className="text-lg font-medium text-gray-600">
                      /month
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : addonsError ? (
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-lg p-4 shadow-sm">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              Error Loading Addons
            </h3>
            <p className="text-xs text-red-700 mb-3">{addonsError}</p>
            <button
              onClick={fetchAddons}
              className="px-4 py-2 bg-[#43A2C9] hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      ) : addons.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-gray-600">No addons available at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-2xl">
          {addons.map((addon) => {
            const addonPeriod = addonPeriods[addon.id] || "month";
            const quantity = addonQuantities[addon.id] || 1;
            const basePrice = getAddonPrice(
              addon,
              addonPeriod === "year",
              region
            );
            const totalPrice = basePrice * quantity;
            const currencySymbol = getCurrencySymbol(region);
            const isSelected = selectedAddons.some((a) => a.id === addon.id);

            return (
              <div
                key={addon.id}
                onClick={() => handleAddonSelection(addon)}
                className={`border-3 rounded-2xl p-3 flex flex-col ${
                  isSelected
                    ? "border-[#43A2C9] bg-[#43A2C9]/5 shadow-lg"
                    : "border-gray-200 bg-white hover:border-[#43A2C9] hover:shadow-md hover:bg-gray-50"
                }`}
              >
                {/* Addon selection checkbox */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">
                      {addon.name}
                    </span>
                  </div>
                </div>

                {/* Quantity selector for selected addons */}
                <div
                  className={`flex items-center gap-2 ${
                    !isSelected ? "bg-[#43A2C9]/5 opacity-50" : ""
                  }`}
                >
                  <span className="text-xs font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentQty = addonQuantities[addon.id] || 1;
                        handleAddonQuantityChange(addon.id, currentQty - 1);
                      }}
                      disabled={!isSelected}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                      {addonQuantities[addon.id] || 1}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const currentQty = addonQuantities[addon.id] || 1;
                        handleAddonQuantityChange(addon.id, currentQty + 1);
                      }}
                      disabled={!isSelected}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-300 text-gray-800">
                      {basePrice === 0
                        ? "Free"
                        : `${currencySymbol}${totalPrice}`}
                      <span className="text-lg font-medium text-gray-600">
                        /month
                      </span>
                    </span>
                    {/* {quantity > 1 && (
                      <span className="text-xs text-gray-500">
                        {currencySymbol}
                        {basePrice} × {quantity}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Skip Addons
        </button>

        <button
          type="button"
          onClick={handleProceedToPayment}
          disabled={!canProceed() || selectedAddons.length === 0}
          className="px-6 py-2 bg-[#43A2C9] text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {addonsLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </div>
          ) : selectedAddons.length === 0 ? (
            "Select Addons"
          ) : (
            `Add ${selectedAddons.length} Addon${
              selectedAddons.length > 1 ? "s" : ""
            }`
          )}
        </button>
      </div>
    </div>
  );
}
