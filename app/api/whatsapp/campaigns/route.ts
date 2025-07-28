import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import axios from "axios";
import { cookies } from "next/headers";

// Get all campaigns for an account
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    let campaigns = await prisma.whatsAppCampaign.findMany({
      where: {
        account: {
          id: id as string,
          user: {
            email: session.email,
          },
        },
      },
    });

    const FILTERS = [
      { key: "UNDELIVERED", label: "Undelivered", color: "#EF4444" },
      { key: "UNREAD", label: "Unread", color: "#F59E0B" },
      { key: "READ", label: "Read", color: "#10B981" },
      { key: "REPLIED", label: "Replied", color: "#3B82F6" },
    ];

    // Add chart data to each campaign
    campaigns.map((c: any) => {
      c.chartData = FILTERS.map(f => ({
        Status: f.label,
        Count: c.recipientStats?.filter((r: any) => r.status?.toUpperCase() === f.key).length || 0,
      }));
    });

    // If user is not an enterprise user, set recipient stats to null for all campaigns
    if (session.plan !== "ENTERPRISE") {
      campaigns = campaigns.map((c: any) => ({
        ...c,
        recipientStats: null,
      }));
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

// Create and send a new campaign
export async function POST(request: Request) {
  try {
    const session = await getSession();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.plan) {
      return NextResponse.json({ error: "You are not authorized to create campaigns" }, { status: 400 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "No id provided" }, { status: 400 });
    }

    const body = await request.json();
    const {
      name,
      selectedContacts,
      templateName,
      variables,
      scheduleType,
      scheduledAt,
    } = body;

    if (!name || !selectedContacts || !templateName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get account details for WhatsApp API
    const account = await prisma.whatsAppAccount.findUnique({
      where: {
        id: id,
        user: {
          email: session.email,
        },
      },
      include: {
        phoneNumbers: true,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (session.plan === "BASIC") {
      const existingCampaigns = await prisma.whatsAppCampaign.findMany({
        where: {
          accountId: id,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      });
      // Count total recipients in the last 30 days
      let totalRecipients = 0;
      for (const campaign of existingCampaigns) {
        if (Array.isArray(campaign.recipientStats)) {
          totalRecipients += campaign.recipientStats.length;
        }
      }

      const newTotal = totalRecipients + selectedContacts.length;
      if (newTotal > 2500) {
        const remaining = Math.max(0, 2500 - totalRecipients);
        return NextResponse.json({
          error: `Basic plan limit reached. You can only send to ${remaining} more recipients this month. Upgrade to Premium to send more messages.`
        }, { status: 400 });
      }
    }

    // Create campaign in database
    const campaign = await prisma.whatsAppCampaign.create({
      data: {
        name,
        type: "TEMPLATE",
        templateName: templateName,
        accountId: id,
        status: scheduleType === "scheduled" ? "SCHEDULED" : "PENDING",
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    // If campaign is not scheduled, send messages immediately
    if (scheduleType === "immediate") {
      // Get phone number from account
      const phoneNumber = account.phoneNumbers[0];
      if (!phoneNumber) {
        return NextResponse.json(
          { error: "No phone number found for account" },
          { status: 400 }
        );
      }

      // Send all data to the message API, let it handle personalization
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/whatsapp/messages/send-template-message`, {
        contacts: selectedContacts,
        templateName,
        variables,
        campaignId: campaign.id,
        phoneNumberId: phoneNumber.phoneNumberId
      }, {
        headers: {
          Cookie: `token=${token}`,
        },
      });
    }

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    // If it's an Axios error, log the response data and config
    if (error.isAxiosError) {
      console.error("Axios error details:", {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response && {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        },
      });
    }

    // Log stack trace if available
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}
