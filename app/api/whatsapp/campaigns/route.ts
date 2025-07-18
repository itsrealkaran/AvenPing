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

    const campaigns = await prisma.whatsAppCampaign.findMany({
      where: {
        account: {
          id: id as string,
          user: {
            email: session.email,
          },
        },
      },
    });

    return NextResponse.json(campaigns);
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
