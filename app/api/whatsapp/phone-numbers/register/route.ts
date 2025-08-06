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

    console.log(typeof pin, 'pin');
    console.log(typeof Number(pin), 'pin');

    const response = await axios.post(`https://graph.facebook.com/v23.0/${phoneNumberId}/register?access_token=${whatsappAccount.accessToken}`, {
      pin: Number(pin),
      messaging_product: "whatsapp",
    });

    if (response.status !== 200) {
      return NextResponse.json({ error: 'Failed to register phone number' }, { status: 500 });
    }

    // First find the phone number record
    const phoneNumberRecord = await prisma.whatsAppPhoneNumber.findFirst({
      where: {
        phoneNumberId: phoneNumberId,
        accountId: whatsappAccount.id,
      },
    });

    if (!phoneNumberRecord) {
      return NextResponse.json({ error: 'Phone number not found' }, { status: 404 });
    }

    // Update the phone number record
    await prisma.whatsAppPhoneNumber.update({
      where: {
        id: phoneNumberRecord.id,
      },
      data: {
        isRegistered: true,
      },
    });

    return NextResponse.json(response.data, { status: 200 });


  } catch (error) {
    console.error('Error registering phone number:', error);
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}