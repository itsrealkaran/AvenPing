import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.userId as string
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ subscriptions })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}