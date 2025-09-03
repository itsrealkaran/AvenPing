"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/landing/navbar";
import { formatPin, unformatPin } from "@/lib/utils";
import { Lock, Eye, EyeOff, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);

  // Fix: Prevent multiple intervals
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        setStep("otp");
        setOtpVerified(false); // Reset verification state
        startCountdown();
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // Verify OTP with the backend
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        setStep("password");
      } else {
        toast.error(data.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully!");
        // Redirect to login page
        window.location.href = "/login";
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fix: Prevent multiple intervals and clear on unmount
  const startCountdown = () => {
    setCountdown(300); // 5 minutes
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Password validation helper function
  const isPasswordValid = (password: string) => {
    const requirements = [
      (pw: string) => pw.length >= 8,
      (pw: string) => /[A-Z]/.test(pw),
      (pw: string) => /[a-z]/.test(pw),
      (pw: string) => /\d/.test(pw),
      (pw: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
    ];
    return requirements.every((test) => test(password));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resendOTP = () => {
    if (countdown === 0) {
      handleSendOTP();
    }
  };

  const handleOpenEmail = () => {
    if (!email) {
      toast.error("No email address available");
      return;
    }

    // Extract domain from email
    const domain = email.split("@")[1]?.toLowerCase();

    if (!domain) {
      toast.error("Invalid email format");
      return;
    }

    // Email provider inbox URLs mapping with search parameters
    const emailProviders: { [key: string]: string } = {
      // Gmail
      "gmail.com": `https://mail.google.com/mail/u/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,
      "googlemail.com": `https://mail.google.com/mail/u/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,

      // Outlook/Hotmail
      "outlook.com": `https://outlook.live.com/mail/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,
      "hotmail.com": `https://outlook.live.com/mail/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,
      "live.com": `https://outlook.live.com/mail/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,
      "msn.com": `https://outlook.live.com/mail/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,

      // Yahoo
      "yahoo.com": `https://mail.yahoo.com/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,
      "yahoo.co.uk": `https://mail.yahoo.co.uk/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,
      "yahoo.ca": `https://mail.yahoo.ca/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,
      "yahoo.com.au": `https://mail.yahoo.com.au/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,
      "ymail.com": `https://mail.yahoo.com/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,
      "rocketmail.com": `https://mail.yahoo.com/d/${encodeURIComponent(
        email
      )}/search/keyword=from%3Aforgot-password%40avenping.com`,

      // Apple iCloud
      "icloud.com": "https://www.icloud.com/mail/",
      "me.com": "https://www.icloud.com/mail/",
      "mac.com": "https://www.icloud.com/mail/",

      // ProtonMail
      "protonmail.com": "https://mail.protonmail.com/",
      "proton.me": "https://mail.protonmail.com/",

      // Zoho
      "zoho.com": `https://mail.zoho.com/zm/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,
      "zohomail.com": `https://mail.zoho.com/zm/${encodeURIComponent(
        email
      )}/#search/from%3Aforgot-password%40avenping.com`,

      // AOL
      "aol.com": "https://mail.aol.com/webmail-std/en-us/suite",
      "aim.com": "https://mail.aol.com/webmail-std/en-us/suite",

      // FastMail
      "fastmail.com": "https://www.fastmail.com/mail/",
      "fastmail.fm": "https://www.fastmail.com/mail/",

      // Tutanota
      "tutanota.com": "https://mail.tutanota.com/",
      "tutamail.com": "https://mail.tutanota.com/",

      // Mail.com
      "mail.com": "https://www.mail.com/",

      // GMX
      "gmx.com": "https://www.gmx.com/mail/",
      "gmx.de": "https://www.gmx.com/mail/",
      "gmx.net": "https://www.gmx.com/mail/",

      // Yandex
      "yandex.com": "https://mail.yandex.com/",
      "yandex.ru": "https://mail.yandex.com/",
      "yandex.by": "https://mail.yandex.com/",
      "yandex.kz": "https://mail.yandex.com/",
      "yandex.ua": "https://mail.yandex.com/",

      // QQ Mail
      "qq.com": "https://mail.qq.com/",

      // 163.com
      "163.com": "https://mail.163.com/",
      "126.com": "https://mail.126.com/",
      "sina.com": "https://mail.sina.com.cn/",
      "sohu.com": "https://mail.sohu.com/",
    };

    // Check if we have a direct inbox URL for this provider
    const inboxUrl = emailProviders[domain];

    if (inboxUrl) {
      // Open the specific provider's inbox with search parameters
      window.open(inboxUrl, "_blank");
      toast.success(`Opening ${domain} inbox...`);
    } else {
      // For custom domains, try to detect the business email provider
      const detectBusinessEmailProvider = async (
        domain: string
      ): Promise<string | null> => {
        // Common business email provider patterns and their webmail URLs
        const businessProviders = {
          // Google Workspace (G Suite) - most common
          "googlemail.com": `https://mail.google.com/mail/u/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "gmail.com": `https://mail.google.com/mail/u/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,

          // Microsoft 365 / Office 365
          "outlook.com": `https://outlook.live.com/mail/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "hotmail.com": `https://outlook.live.com/mail/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "live.com": `https://outlook.live.com/mail/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "msn.com": `https://outlook.live.com/mail/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "office365.com": `https://outlook.office365.com/mail/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,

          // Zoho Mail
          "zoho.com": `https://mail.zoho.com/zm/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "zohomail.com": `https://mail.zoho.com/zm/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,
          "zohocorp.com": `https://mail.zoho.com/zm/${encodeURIComponent(
            email
          )}/#search/from%3Aforgot-password%40avenping.com`,

          // Yahoo Business
          "yahoo.com": `https://mail.yahoo.com/d/${encodeURIComponent(
            email
          )}/search/keyword=from%3Aforgot-password%40avenping.com`,
          "ymail.com": `https://mail.yahoo.com/d/${encodeURIComponent(
            email
          )}/search/keyword=from%3Aforgot-password%40avenping.com`,
          "rocketmail.com": `https://mail.yahoo.com/d/${encodeURIComponent(
            email
          )}/search/keyword=from%3Aforgot-password%40avenping.com`,
        };

        // Check for exact domain match first
        if (Object.prototype.hasOwnProperty.call(businessProviders, domain)) {
          return businessProviders[domain as keyof typeof businessProviders];
        }

        // Try to detect email provider using public APIs
        try {
          // Method 1: Use MXToolbox API (free, no API key required)
          const mxResponse = await fetch(
            `https://mxtoolbox.com/api/v1/lookup/mx/${domain}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (mxResponse.ok) {
            const mxData = await mxResponse.json();
            if (mxData.Information && mxData.Information.length > 0) {
              const mxRecord = mxData.Information[0].Name?.toLowerCase() || "";

              // Map MX records to email providers
              if (
                mxRecord.includes("google") ||
                mxRecord.includes("googlemail")
              ) {
                return `https://mail.google.com/mail/u/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (
                mxRecord.includes("outlook") ||
                mxRecord.includes("office365") ||
                mxRecord.includes("microsoft")
              ) {
                return `https://outlook.office365.com/mail/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (mxRecord.includes("zoho")) {
                return `https://mail.zoho.com/zm/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (mxRecord.includes("yahoo")) {
                return `https://mail.yahoo.com/d/${encodeURIComponent(
                  email
                )}/search/keyword=from%3Aforgot-password%40avenping.com`;
              }
            }
          }
        } catch (error) {
          // Fix: Don't log to console in production
        }

        try {
          // Method 2: Use DNS lookup via a public DNS API
          const dnsResponse = await fetch(
            `https://dns.google/resolve?name=${domain}&type=MX`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (dnsResponse.ok) {
            const dnsData = await dnsResponse.json();
            if (dnsData.Answer && dnsData.Answer.length > 0) {
              const mxRecord = dnsData.Answer[0].data?.toLowerCase() || "";

              // Map MX records to email providers
              if (
                mxRecord.includes("google") ||
                mxRecord.includes("googlemail")
              ) {
                return `https://mail.google.com/mail/u/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (
                mxRecord.includes("outlook") ||
                mxRecord.includes("office365") ||
                mxRecord.includes("microsoft")
              ) {
                return `https://outlook.office365.com/mail/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (mxRecord.includes("zoho")) {
                return `https://mail.zoho.com/zm/${encodeURIComponent(
                  email
                )}/#search/from%3Aforgot-password%40avenping.com`;
              } else if (mxRecord.includes("yahoo")) {
                return `https://mail.yahoo.com/d/${encodeURIComponent(
                  email
                )}/search/keyword=from%3Aforgot-password%40avenping.com`;
              }
            }
          }
        } catch (error) {
          // Fix: Don't log to console in production
        }

        // Fallback: For custom domains, try the most common business email providers
        // Most businesses use Google Workspace or Microsoft 365
        const commonBusinessUrls = [
          {
            url: `https://mail.google.com/mail/u/${encodeURIComponent(
              email
            )}/#search/from%3Aforgot-password%40avenping.com`,
            name: "Google Workspace",
          },
          {
            url: `https://outlook.office365.com/mail/${encodeURIComponent(
              email
            )}/#search/from%3Aforgot-password%40avenping.com`,
            name: "Microsoft 365",
          },
          {
            url: `https://mail.zoho.com/zm/${encodeURIComponent(
              email
            )}/#search/from%3Aforgot-password%40avenping.com`,
            name: "Zoho Mail",
          },
        ];

        // Return the most common one (Google Workspace) for custom domains
        return commonBusinessUrls[0].url;
      };

      detectBusinessEmailProvider(domain)
        .then((businessProviderUrl) => {
          if (businessProviderUrl) {
            // Open the detected business provider's inbox
            window.open(businessProviderUrl, "_blank");
            toast.success(`Opening business email inbox for ${domain}...`);
          } else {
            // For unknown providers, try to open their website
            const genericMailUrl = `https://${domain}`;
            const newWindow = window.open(genericMailUrl, "_blank");

            if (newWindow) {
              toast.warning(
                `Opening ${domain} website. Please search for emails from forgot-password@avenping.com`
              );
            } else {
              // Fallback to mailto if popup is blocked
              window.open(`mailto:${email}`, "_blank");
              toast.info(`Opening default email client for ${email}`);
            }
          }
        })
        .catch(() => {
          // Fallback to opening the domain website
          const genericMailUrl = `https://${domain}`;
          const newWindow = window.open(genericMailUrl, "_blank");

          if (newWindow) {
            toast.warning(
              `Opening ${domain} website. Please search for emails from forgot-password@avenping.com`
            );
          } else {
            // Fallback to mailto if popup is blocked
            window.open(`mailto:${email}`, "_blank");
            toast.info(`Opening default email client for ${email}`);
          }
        });
    }
  };

  // Security check - prevent direct access to password step
  useEffect(() => {
    if (step === "password" && !otpVerified) {
      setStep("email");
      toast.error("Please complete the OTP verification first");
    }
  }, [step, otpVerified]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#DFFFF9] via-white to-[#FDCEFF]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col items-center justify-center space-y-1">
        {/* Header */}
        <Navbar />

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border-4 border-black/10 p-6 sm:p-8 w-full max-w-md">
          <div className="pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-600">
              {step === "email" && "Enter your email to receive a reset code"}
              {step === "otp" && "Enter the 6-digit code sent to your email"}
              {step === "password" && "Enter your new password"}
            </p>
          </div>

          <div className="space-y-4">
            {/* Step 1: Email Input */}
            {step === "email" && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-[#43A2C9] hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#43A2C9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    "Send Reset Code"
                  )}
                </Button>
              </>
            )}

            {/* Step 2: OTP Input */}
            {step === "otp" && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="otp"
                    className="text-sm font-medium text-gray-700"
                  >
                    6-Digit Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formatPin(otp)}
                    onChange={(e) => setOtp(unformatPin(e.target.value))}
                    className="text-center text-lg tracking-widest w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <Button
                  onClick={resendOTP}
                  disabled={countdown > 0}
                  variant="link"
                >
                  {countdown > 0
                    ? `Resend in ${formatTime(countdown)}`
                    : "Resend Code"}
                </Button>

                <div className="space-y-3">
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={!otp || otp.length !== 6 || loading}
                    className="w-full bg-[#43A2C9] hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#43A2C9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setStep("email");
                        setOtp("");
                        setOtpVerified(false);
                        if (timerRef.current) clearInterval(timerRef.current);
                        setCountdown(0);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Back to Email
                    </Button>

                    <Button
                      onClick={handleOpenEmail}
                      variant="outline"
                      className="flex-1"
                    >
                      Open Email
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: New Password Input */}
            {step === "password" && otpVerified && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    New Password
                    {/* Tooltip for password requirements */}
                    <span className="relative group ml-1">
                      <Info size={16} className="cursor-pointer" />
                      <div className="absolute left-1/2 z-10 hidden group-hover:block group-focus:block -translate-x-1/2 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs text-gray-700">
                        <div className="font-semibold mb-1 text-gray-900">
                          Password must contain:
                        </div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>At least 8 characters</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one lowercase letter</li>
                          <li>At least one number</li>
                          <li>
                            At least one special character
                            <br />
                            (e.g. !@#$%^&amp;*)
                          </li>
                        </ul>
                      </div>
                    </span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Password strength validation - show only the first unmet requirement */}
                  {newPassword.length > 0 &&
                    (() => {
                      const requirements = [
                        {
                          test: (pw: string) => pw.length >= 8,
                          message: "At least 8 characters",
                        },
                        {
                          test: (pw: string) => /[A-Z]/.test(pw),
                          message: "At least one uppercase letter",
                        },
                        {
                          test: (pw: string) => /[a-z]/.test(pw),
                          message: "At least one lowercase letter",
                        },
                        {
                          test: (pw: string) => /\d/.test(pw),
                          message: "At least one number",
                        },
                        {
                          test: (pw: string) =>
                            /[!@#$%^&*(),.?\":{}|<>]/.test(pw),
                          message: "At least one special character",
                        },
                      ];
                      const firstUnmet = requirements.find(
                        (r) => !r.test(newPassword)
                      );
                      if (firstUnmet) {
                        return (
                          <div className="flex items-center mt-2">
                            <span className="text-xs font-medium text-red-500">
                              ✗ {firstUnmet.message}
                            </span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center mt-2">
                            <span className="text-xs font-medium text-green-600">
                              Strong password
                            </span>
                          </div>
                        );
                      }
                    })()}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#43A2C9] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && (
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-xs font-medium ${
                          newPassword === confirmPassword
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {newPassword === confirmPassword
                          ? "Passwords match"
                          : "Passwords do not match"}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleResetPassword}
                  disabled={
                    loading ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    !isPasswordValid(newPassword)
                  }
                  className="w-full bg-[#43A2C9] hover:bg-cyan-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#43A2C9] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Resetting...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            By proceeding, you agree to our{" "}
            <Link
              href="https://avenping.com/terms-of-service"
              className="text-[#43A2C9] hover:text-cyan-600"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://avenping.com/privacy-policy"
              className="text-[#43A2C9] hover:text-cyan-600"
            >
              Privacy Policy
            </Link>
          </p>

          <p className="text-xs sm:text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-[#43A2C9] hover:text-cyan-600 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
