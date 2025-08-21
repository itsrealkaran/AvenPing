import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plans: true,
        whatsAppAccount: {
          select: {
            id: true,
            phoneNumbers: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
                phoneNumberId: true,
                isRegistered: true,
                codeVerificationStatus: true,
              },
            },
          }
        },
      },
    });
    
    const userData = {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      plans: user?.plans,
      whatsappAccount: {
        id: user?.whatsAppAccount?.id,
        name: user?.name,
        email: user?.email,
        phoneNumbers: user?.whatsAppAccount?.phoneNumbers,
        codeVerificationStatus: user?.whatsAppAccount?.phoneNumbers[0]?.codeVerificationStatus,
      },
    };

    return NextResponse.json({ userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}