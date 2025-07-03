import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || !session.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const account = await prisma.whatsAppAccount.findFirst({
    where: {
      user: {
        email: session.email,
      },
    },
  });

  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = account.accessToken;

  return NextResponse.json({ token });
}