import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
    }

    const attributes = await prisma.contactAttribute.findMany({
      where: {
        accountId: whatsappAccount.id,
      },
    });
    return NextResponse.json(attributes);
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json({ error: "Failed to fetch attributes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
    }

    const existingAttribute = await prisma.contactAttribute.findMany({
      where: {
        accountId: whatsappAccount.id,
      },
    });

    if (existingAttribute.length >= 8) {
      return NextResponse.json({ error: "You can only have 8 attributes" }, { status: 400 });
    }

    if (existingAttribute.find((attribute) => attribute.name === name)) {
      return NextResponse.json({ error: "Attribute already exists" }, { status: 400 });
    }

    const attribute = await prisma.contactAttribute.create({
      data: {
        name,
        type,
        accountId: whatsappAccount.id,
      },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json({ error: "Failed to create attribute" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
    }

    const { id, name, type } = await request.json();

    const attribute = await prisma.contactAttribute.update({
      where: { id },
      data: { name, type },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.error("Error updating attribute:", error);
    return NextResponse.json({ error: "Failed to update attribute" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.findFirst({
      where: {
        user: {
          email: session.email,
        },
      },
    });

    if (!whatsappAccount) {
      return NextResponse.json({ error: "Whatsapp account not found" }, { status: 404 });
    }

    const { id } = await request.json();

    const attribute = await prisma.contactAttribute.delete({
      where: { id },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return NextResponse.json({ error: "Failed to delete attribute" }, { status: 500 });
  }
}