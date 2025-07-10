import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const phoneNumberId = searchParams.get("phoneNumberId") as string;

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const flows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(flows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, trigger, automationJson, status = "INACTIVE" } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const flow = await prisma.whatsAppFlow.create({
      data: {
        name,
        trigger,
        automationJson,
        recipientArray: [],
        status,
        accountId: user.whatsAppAccount.id,
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, trigger, automationJson, status } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (trigger !== undefined) updateData.trigger = trigger;
    if (automationJson !== undefined) updateData.automationJson = automationJson;
    if (status !== undefined) updateData.status = status;

    const flow = await prisma.whatsAppFlow.update({
      where: { 
        id,
        accountId: user.whatsAppAccount.id, // Ensure user can only update their own flows
      },
      data: updateData,
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const flow = await prisma.whatsAppFlow.delete({
      where: { 
        id,
        accountId: user.whatsAppAccount.id, // Ensure user can only delete their own flows
      },
    });

    return NextResponse.json(flow);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}