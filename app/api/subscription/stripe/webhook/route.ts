import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
      
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break
      
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log("Processing checkout.session.completed")
  
  if (session.payment_status === "paid" && session.metadata) {
    const userId = session.metadata.userId
    const planId = session.metadata.planId
    const planPeriod = session.metadata.planPeriod
    
    if (userId && planId) {
      // Calculate expiration date based on plan period
      const expiresAt = new Date()
      
      if (planPeriod === "YEARLY") {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      } else {
        // Default to monthly
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          planId: planId,
          expiresAt: expiresAt,
        },
      })
      
      console.log(`Updated user ${userId} with plan ${planId} for ${planPeriod} period`)
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("Processing invoice.payment_succeeded")
  
  const customerEmail = invoice.customer_email
  
  if (customerEmail) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    })
    
    if (user) {
      // Get the subscription to determine the interval
      const invoiceData = invoice as any
      const subscription = await stripe.subscriptions.retrieve(invoiceData.subscription_id)
      const interval = subscription.items.data[0]?.price?.recurring?.interval || 'month'
      
      // Calculate new expiration date based on subscription interval
      const expiresAt = new Date()
      
      if (interval === 'year') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)
      } else {
        // Default to monthly
        expiresAt.setMonth(expiresAt.getMonth() + 1)
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          expiresAt: expiresAt,
        },
      })
      
      console.log(`Extended subscription for user ${user.id} by ${interval}`)
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log("Processing invoice.payment_failed")
  
  const customerEmail = invoice.customer_email
  
  if (customerEmail) {
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    })
    
    if (user) {
      // You might want to send a notification to the user
      // or update their status to indicate payment issues
      console.log(`Payment failed for user ${user.id}`)
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.deleted")
  
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  
  if ('email' in customer && customer.email) {
    const user = await prisma.user.findUnique({
      where: { email: customer.email },
    })
    
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          planId: null,
          expiresAt: null,
        },
      })
      
      console.log(`Removed plan for user ${user.id}`)
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("Processing customer.subscription.updated")
  
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  
  if ('email' in customer && customer.email) {
    const user = await prisma.user.findUnique({
      where: { email: customer.email },
    })
    
    if (user) {
      // Update subscription details if needed
      // This could include updating plan features, expiration dates, etc.
      console.log(`Updated subscription for user ${user.id}`)
    }
  }
} 