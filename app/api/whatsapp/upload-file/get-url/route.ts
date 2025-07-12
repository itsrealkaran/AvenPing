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
    const mediaId = searchParams.get('mediaId');

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

    const media = await axios.get(`https://graph.facebook.com/v23.0/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${whatsappAccount.accessToken}`,
      },
    });

    return NextResponse.json({ mediaUrl: media.data.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get media ID" }, { status: 500 });
  }
}