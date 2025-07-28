import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || !user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get('mediaUrl');

    if (!mediaUrl) {
      return NextResponse.json({ error: "Media URL not found" }, { status: 404 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          id: user.userId as string,
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
    }

    // Download the actual media file
    const mediaFile = await axios.get(mediaUrl, {
      headers: {
        Authorization: `Bearer ${whatsappAccount.accessToken}`,
      },
      responseType: "arraybuffer",
    });

    // Convert to base64 for frontend display
    const base64 = Buffer.from(mediaFile.data).toString(
      "base64"
    );
    const dataUrl = `data:${mediaFile.data.mime_type};base64,${base64}`;

    return NextResponse.json({ mediaUrl: dataUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get media ID" }, { status: 500 });
  }
}