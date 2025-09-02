import { loadScript } from "./utils"

declare global {
  interface Window {
    Razorpay: any
  }
}

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: {
    [key: string]: string
  }
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
  callback_url?: string
  redirect?: boolean
}

export const loadRazorpayScript = async (): Promise<void> => {
  if (typeof window !== "undefined" && window.Razorpay) {
    return
  }

  await loadScript("https://checkout.razorpay.com/v1/checkout.js")
}

export const createRazorpayOrder = async (planName: string, planPeriod: string, region: string, isAddon?: boolean, months?: number, quantity?: number, redirectUrl?: string) => {
  try {
    const response = await fetch("/api/subscription/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planName,
        planPeriod,
        region,
        isAddon,
        months,
        quantity,
        redirectUrl,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create order")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export const initiateRazorpayPayment = async (
  planName: string,
  planPeriod: string,
  region: string,
  userEmail: string,
  userName: string,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  isAddon?: boolean,
  months?: number,
  quantity?: number,
  redirectUrl?: string
) => {
  try {
    // Load Razorpay script
    await loadRazorpayScript()

    // Create order
    const orderData = await createRazorpayOrder(planName, planPeriod, region, isAddon, months, quantity, redirectUrl)
    console.log("orderData", orderData)

    const options: RazorpayOptions = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "AvenPing",
      description: `Subscription to ${planName} plan`,
      order_id: orderData.orderId,
      prefill: {
        name: userName,
        email: userEmail,
      },
      notes: {
        subscriptionId: orderData.subscriptionId,
      },
      theme: {
        color: "#6366f1",
      },
      handler: (response) => {
        // Verify payment on server
        verifyPayment(response)
          .then(() => {
            onSuccess(response)
          })
          .catch((error) => {
            onError(error)
          })
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal closed")
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  } catch (error) {
    console.error("Error initiating Razorpay payment:", error)
    onError(error)
  }
}

export const verifyPayment = async (response: any) => {
  try {
    const verifyResponse = await fetch(
      `/api/subscription/razorpay?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}&razorpay_signature=${response.razorpay_signature}`,
      {
        method: "GET",
      }
    )

    if (!verifyResponse.ok) {
      throw new Error("Payment verification failed")
    }

    const data = await verifyResponse.json()
    return data
  } catch (error) {
    console.error("Error verifying payment:", error)
    throw error
  }
}

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount / 100) // Convert from paise to rupees
}

// Official Razorpay payment verification function
export const validatePaymentVerification = (
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): boolean => {
  const crypto = require("crypto")
  const text = `${orderId}|${paymentId}`
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex")

  return generatedSignature === signature
}

// Enhanced payment verification with official Razorpay SDK
export const verifyPaymentWithSDK = async (
  orderId: string,
  paymentId: string,
  signature: string
) => {
  try {
    const response = await fetch("/api/subscription/razorpay/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_id: paymentId,
        signature: signature,
      }),
    })

    if (!response.ok) {
      throw new Error("Payment verification failed")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying payment with SDK:", error)
    throw error
  }
} 