import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { phoneNumberId, pin } = body;

    if (!phoneNumberId) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

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
      return NextResponse.json({ error: 'WhatsApp account not found' }, { status: 404 });
    }

    console.log(whatsappAccount.accessToken, 'access token');

    const response = await axios.post(`https://graph.facebook.com/v23.0/${phoneNumberId}/register?access_token=${whatsappAccount.accessToken}`, {
      pin,
      messaging_product: "whatsapp",
    });
    console.log(response.data, 'response from register phone number');

    return NextResponse.json(response.data, { status: 200 });


  } catch (error) {
    console.error('Error registering phone number:', error);
    return NextResponse.json(
      { error: 'Failed to register phone number' },
      { status: 500 }
    );
  }
}