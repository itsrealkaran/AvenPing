import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

interface OBARequestData {
  additional_supporting_information?: string;
  business_website_url: string;
  parent_business_or_brand: string;
  primary_country_of_operation: string;
  primary_language: string;
  supporting_links: string[];
}

export async function POST(request: NextRequest) {
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

    const requestData: OBARequestData = await request.json();

    // Validate required fields
    if (!requestData.business_website_url || 
        !requestData.parent_business_or_brand || 
        !requestData.primary_country_of_operation || 
        !requestData.primary_language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare the request payload for WhatsApp API
    const whatsappPayload: any = {
      business_website_url: requestData.business_website_url,
      parent_business_or_brand: requestData.parent_business_or_brand,
      primary_country_of_operation: requestData.primary_country_of_operation,
      primary_language: requestData.primary_language,
    };

    // Add optional fields if they exist
    if (requestData.additional_supporting_information) {
      whatsappPayload.additional_supporting_information = requestData.additional_supporting_information;
    }

    // Filter out empty supporting links and add if any exist
    const validSupportingLinks = requestData.supporting_links.filter(link => link.trim() !== "");
    if (validSupportingLinks.length > 0) {
      whatsappPayload.supporting_links = validSupportingLinks;
    }

    // Call WhatsApp Graph API to submit OBA request
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/official_business_account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${whatsappAccount.accessToken}`,
        },
        body: JSON.stringify(whatsappPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("WhatsApp API error:", errorData);
      return NextResponse.json(
        { error: "Failed to submit OBA request to WhatsApp" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: "OBA request submitted successfully",
    });

  } catch (error) {
    console.error("Error submitting OBA request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 