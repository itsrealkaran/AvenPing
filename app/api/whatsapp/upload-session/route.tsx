import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { file_name, file_length, file_type, userId } = await request.json();

    const userAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          id: userId,
        },
      }
    });

    if (!userAccount) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    console.log(process.env.META_APP_ID, "meta app id")

    const uploadSession = await axios.post(`https://graph.facebook.com/v22.0/${process.env.META_APP_ID}/uploads`, {
      file_name,
      file_length,
      file_type,
    }, {
      headers: {
        Authorization: `Bearer ${userAccount.accessToken}`,
      },
    });

    return NextResponse.json({ id: uploadSession.data.id, accessToken: userAccount.accessToken }, { status: 200 });
  } catch (error) {
    console.log(error)
  }
}
