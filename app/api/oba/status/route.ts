import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get user session
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get phone number ID from query parameters
    const { searchParams } = new URL(request.url);
    const phoneNumberId = searchParams.get("phoneNumberId");

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: "Phone number ID is required" },
        { status: 400 }
      );
    }

    // Get user's WhatsApp account from database
    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: {
            equals: session.email as string,
            mode: "insensitive",
          },
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json(
        { error: "WhatsApp account not found" },
        { status: 404 }
      );
    }

    // Verify that the phone number belongs to the user's account
    const phoneNumber = await prisma.whatsAppPhoneNumber.findFirst({
      where: {
        phoneNumberId: phoneNumberId,
        accountId: whatsappAccount.id,
      },
    });

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number not found or does not belong to your account" },
        { status: 404 }
      );
    }

    // Call WhatsApp Graph API to get OBA status
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${phoneNumberId}?fields=official_business_account`,
      {
        headers: {
          Authorization: `Bearer ${whatsappAccount.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch OBA status from WhatsApp" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return the OBA status
    return NextResponse.json({
      oba_status: data.official_business_account?.oba_status || "NOT_STARTED",
    });

  } catch (error) {
    console.error("Error checking OBA status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 