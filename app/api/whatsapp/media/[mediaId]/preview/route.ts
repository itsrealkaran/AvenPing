import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { mediaId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mediaId } = params;
    if (!mediaId) {
      return NextResponse.json(
        { error: "Media ID is required" },
        { status: 400 }
      );
    }

    // Get the user's WhatsApp account to access the access token
    const account = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "WhatsApp account not found" },
        { status: 404 }
      );
    }

    const accessToken = account.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "WhatsApp access token not found" },
        { status: 404 }
      );
    }

    // Call WhatsApp Graph API to get media URL using axios (following existing pattern)
    // Reference: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media
    console.log(`Fetching media ${mediaId} from WhatsApp API`);
    
    const mediaResponse = await axios.get(
      `https://graph.facebook.com/v23.0/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const mediaData = mediaResponse.data;
    console.log("WhatsApp media response:", mediaData);

    // Extract the media URL from the response
    const mediaUrl = mediaData.url;
    const mimeType = mediaData.mime_type;
    const sha256 = mediaData.sha256;
    const fileSize = mediaData.file_size;

    if (!mediaUrl) {
      console.error("Media URL not found in response:", mediaData);
      return NextResponse.json(
        { error: "Media URL not found in response" },
        { status: 404 }
      );
    }

    // Download the media content using axios (following existing pattern)
    console.log(`Downloading media content from: ${mediaUrl}`);
    
    const mediaContentResponse = await axios.get(mediaUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer', // Get binary data
    });

    // Convert arraybuffer to blob
    const mediaBlob = new Blob([mediaContentResponse.data], { 
      type: mimeType || "application/octet-stream" 
    });
    
    console.log(`Media downloaded successfully. Size: ${mediaBlob.size} bytes, Type: ${mimeType}`);
    
    // Return the media content with proper headers
    return new NextResponse(mediaBlob, {
      status: 200,
      headers: {
        "Content-Type": mimeType || "application/octet-stream",
        "Content-Length": fileSize?.toString() || mediaBlob.size.toString(),
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    // Follow existing error handling pattern
    console.error("Error fetching media preview:", error);
    
    if (error.response) {
      // Axios error with response
      console.error("WhatsApp API error:", error.response.status, error.response.statusText);
      console.error("Error details:", error.response.data);
      
      return NextResponse.json(
        { 
          error: "Failed to fetch media from WhatsApp API",
          details: error.response.data || error.response.statusText
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // Axios error without response
      console.error("No response received from WhatsApp API");
      return NextResponse.json(
        { error: "No response from WhatsApp API" },
        { status: 500 }
      );
    } else {
      // Other error
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
} 