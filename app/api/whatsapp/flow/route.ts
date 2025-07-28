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

    const { name, triggers, automationJson, status = "INACTIVE" } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const existingFlows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
    });
    
    if (existingFlows.find(flow => flow.automationJson.find((t: any) => t.triggers.find((t: any) => triggers.some((t: any) => t.trigger === t.trigger))))) {
      return NextResponse.json({ error: "Trigger already exists" }, { status: 400 });
    }

    const flow = await prisma.whatsAppFlow.create({
      data: {
        name,
        triggers,
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

    const { id, name, triggers, automationJson, status } = await req.json();

    // Get the user's WhatsApp account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { whatsAppAccount: true },
    });

    if (!user?.whatsAppAccount) {
      return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
    }

    const existingFlows = await prisma.whatsAppFlow.findMany({
      where: {
        accountId: user.whatsAppAccount.id,
      },
    });

    if (existingFlows.find(flow => flow.automationJson.find((t: any) => t.triggers.find((t: any) => triggers.some((t: any) => t.trigger === t.trigger))))) {
      return NextResponse.json({ error: "Trigger already exists" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (triggers !== undefined) updateData.triggers = triggers;
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