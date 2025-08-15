"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";

interface OBAResponse {
  success: boolean;
}

interface OBAStatus {
  oba_status: string;
}

export default function BlueTickSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [obaStatus, setObaStatus] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    additional_supporting_information: "",
    business_website_url: "",
    parent_business_or_brand: "",
    primary_country_of_operation: "",
    primary_language: "",
    supporting_links: [""],
  });

  const { userInfo } = useUser();

  // Check current OBA status
  const checkOBAStatus = async () => {
    if (!userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId) {
      toast.error("No WhatsApp phone number found");
      return;
    }

    setIsCheckingStatus(true);
    try {
      const response = await fetch(
        `/api/oba/status?phoneNumberId=${userInfo.whatsappAccount.activePhoneNumber.phoneNumberId}`
      );
      if (response.ok) {
        const data: OBAStatus = await response.json();
        setObaStatus(data.oba_status);

        if (data.oba_status === "NOT_STARTED") {
          setShowForm(true);
        }
      } else {
        toast.error("Failed to check OBA status");
      }
    } catch (error) {
      console.error("Error checking OBA status:", error);
      toast.error("Failed to check OBA status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Submit OBA request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId) {
      toast.error("No WhatsApp phone number found");
      return;
    }

    // Validate required fields
    if (
      !formData.business_website_url ||
      !formData.parent_business_or_brand ||
      !formData.primary_country_of_operation ||
      !formData.primary_language
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/oba/request?phoneNumberId=${userInfo.whatsappAccount.activePhoneNumber.phoneNumberId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data: OBAResponse = await response.json();
        if (data.success) {
          toast.success("OBA request submitted successfully!");
          setShowForm(false);
          // Refresh status
          await checkOBAStatus();
        } else {
          toast.error("Failed to submit OBA request");
        }
      } else {
        toast.error("Failed to submit OBA request");
      }
    } catch (error) {
      console.error("Error submitting OBA request:", error);
      toast.error("Failed to submit OBA request");
    } finally {
      setIsLoading(false);
    }
  };

  // Add supporting link field
  const addSupportingLink = () => {
    setFormData((prev) => ({
      ...prev,
      supporting_links: [...prev.supporting_links, ""],
    }));
  };

  // Remove supporting link field
  const removeSupportingLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      supporting_links: prev.supporting_links.filter((_, i) => i !== index),
    }));
  };

  // Update supporting link
  const updateSupportingLink = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      supporting_links: prev.supporting_links.map((link, i) =>
        i === index ? value : link
      ),
    }));
  };

  // Check status on component mount
  useEffect(() => {
    if (userInfo?.whatsappAccount?.activePhoneNumber?.phoneNumberId) {
      checkOBAStatus();
    }
  }, [userInfo]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return {
          text: "Not Started",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
      case "PENDING":
        return {
          text: "Pending Review",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      case "APPROVED":
        return {
          text: "Approved",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "REJECTED":
        return {
          text: "Rejected",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      default:
        return {
          text: "Unknown",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  const statusInfo = getStatusDisplay(obaStatus);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span>Settings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900 font-medium">Blue Tick Request</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Blue Tick Verification
        </h3>

        {/* Status Display */}
        <div className="text-center py-6 mb-6">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} mb-4`}
          >
            {obaStatus ? statusInfo.text : "Checking..."}
          </div>

          {obaStatus === "NOT_STARTED" && (
            <>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Request Blue Tick Verification
              </h4>
              <p className="text-gray-600 mb-4">
                Submit your business information to request Official Business
                Account (OBA) status.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Request Blue Tick
              </Button>
            </>
          )}

          {obaStatus === "PENDING" && (
            <>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Request Under Review
              </h4>
              <p className="text-gray-600">
                Your OBA request is currently being reviewed by WhatsApp. This
                process may take several business days.
              </p>
            </>
          )}

          {obaStatus === "APPROVED" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Blue Tick Approved!
              </h4>
              <p className="text-gray-600">
                Congratulations! Your WhatsApp Business account has been
                verified with Official Business Account status.
              </p>
            </>
          )}

          {obaStatus === "REJECTED" && (
            <>
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Request Rejected
              </h4>
              <p className="text-gray-600 mb-4">
                Your OBA request was not approved. You may submit a new request
                with updated information.
              </p>
              <Button onClick={() => setShowForm(true)} variant="outline">
                Submit New Request
              </Button>
            </>
          )}

          {!obaStatus && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Checking status...</span>
            </div>
          )}
        </div>

        {/* Refresh Status Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={checkOBAStatus}
            disabled={isCheckingStatus}
            size="sm"
          >
            {isCheckingStatus ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Refresh Status"
            )}
          </Button>
        </div>

        {/* OBA Request Form */}
        {showForm && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Business Information
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="business_website_url"
                    className="text-sm font-medium text-gray-700"
                  >
                    Business Website URL *
                  </Label>
                  <Input
                    id="business_website_url"
                    type="url"
                    value={formData.business_website_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        business_website_url: e.target.value,
                      }))
                    }
                    placeholder="https://www.yourbusiness.com"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="parent_business_or_brand"
                    className="text-sm font-medium text-gray-700"
                  >
                    Parent Business or Brand *
                  </Label>
                  <Input
                    id="parent_business_or_brand"
                    type="text"
                    value={formData.parent_business_or_brand}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        parent_business_or_brand: e.target.value,
                      }))
                    }
                    placeholder="Your Business LLC"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="primary_country_of_operation"
                    className="text-sm font-medium text-gray-700"
                  >
                    Primary Country of Operation *
                  </Label>
                  <Input
                    id="primary_country_of_operation"
                    type="text"
                    value={formData.primary_country_of_operation}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_country_of_operation: e.target.value,
                      }))
                    }
                    placeholder="United States of America"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="primary_language"
                    className="text-sm font-medium text-gray-700"
                  >
                    Primary Language *
                  </Label>
                  <Input
                    id="primary_language"
                    type="text"
                    value={formData.primary_language}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        primary_language: e.target.value,
                      }))
                    }
                    placeholder="English"
                    required
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="additional_supporting_information"
                  className="text-sm font-medium text-gray-700"
                >
                  Additional Supporting Information
                </Label>
                <Textarea
                  id="additional_supporting_information"
                  value={formData.additional_supporting_information}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      additional_supporting_information: e.target.value,
                    }))
                  }
                  placeholder="Provide additional information about your business, media mentions, awards, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Supporting Links
                </Label>
                <div className="space-y-2">
                  {formData.supporting_links.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        value={link}
                        onChange={(e) =>
                          updateSupportingLink(index, e.target.value)
                        }
                        placeholder="https://example.com/article-about-your-business"
                        className="flex-1"
                      />
                      {formData.supporting_links.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSupportingLink(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSupportingLink}
                    className="mt-2"
                  >
                    + Add Supporting Link
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
