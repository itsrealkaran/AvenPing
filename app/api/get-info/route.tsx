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
        whatsAppAccount: {
          select: {
            id: true,
            phoneNumbers: {
              select: {
                id: true,
                phoneNumber: true,
                phoneNumberId: true,
              },
            },
          }
        },
      },
    });
    
    const userData = {
      whatsappAccount: user?.whatsAppAccount,
    };

    return NextResponse.json({ userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}