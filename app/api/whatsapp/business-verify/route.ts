import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: { user: { id: session.userId as string } },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: 'WhatsApp account not found' }, { status: 404 });
    }
    
    const response = await axios.get(`https://graph.facebook.com/v23.0/${whatsappAccount.wabaid}?fields=status,name,health_status,business_verification_status`, {
      headers: {
        Authorization: `Bearer ${whatsappAccount.accessToken}`,
      },
    });

    if (response.status !== 200) {
      return NextResponse.json({ error: 'Failed to verify WhatsApp account' }, { status: 500 });
    }

    const updatedWhatsappAccount = await prisma.whatsAppAccount.update({
      where: { id: whatsappAccount.id },
      data: { 
        status: response.data.status,
        healthStatus: response.data.health_status,
        businessVerificationStatus: response.data.business_verification_status,
        ...(response.data.name && { displayName: response.data.name }),
      },
    });

    if (response.data.business_verification_status === 'verified') {
      return NextResponse.json({ success: true, isVerified: true }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, isVerified: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify WhatsApp account' , success: false, isVerified: false }, { status: 500 });
  }
}