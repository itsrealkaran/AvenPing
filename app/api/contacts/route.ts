import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const phoneNumberId = searchParams.get("phoneNumberId");

    if (!phoneNumberId) {
      return NextResponse.json({ error: "Phone number ID is required" }, { status: 400 });
    }

    const contacts = await prisma.whatsAppRecipient.findMany({
      where: {
        whatsAppPhoneNumber: {
          id: phoneNumberId,
        },
      },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json()
    const { name, phoneNumber, phoneNumberId, attributes = [] } = body

    const attributeValues = (attributes || []).map((attribute: any) => ({
      name: attribute.name,
      value: attribute.value,
    }));

    const existingAttributes = await prisma.contactAttribute.findMany({
      where: {
        account: {
          user: {
            email: session.email,
          },
        },
      },
    });

    // get the attribute names from the attributeValues
    const attributeNames = attributeValues.map((attribute: any) => attribute.name);

    // check if the attribute names are in the existingAttributes
    if (attributeNames.some((name: string) => !existingAttributes.some((attribute: any) => attribute.name === name))) {
      return NextResponse.json({ error: "New attribute name cannot be created" }, { status: 400 });
    }

    const contact = await prisma.whatsAppRecipient.create({
      data: {
        name,
        phoneNumber: phoneNumber.replace(/[^\d]/g, ''),
        whatsAppPhoneNumber: {
          connect: {
            id: phoneNumberId,
          },
        },
        attributeValues: attributeValues,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json()
    const { id, name, phoneNumber, attributes = [] } = body

    const attributeValues = (attributes || []).map((attribute: any) => ({
      name: attribute.name,
      value: attribute.value,
    }));

    const existingAttributes = await prisma.contactAttribute.findMany({
      where: {
        account: {
          user: {
            email: session.email,
          },
        },
      },
    });

    // get the attribute names from the attributeValues
    const attributeNames = attributeValues.map((attribute: any) => attribute.name);

    // check if the attribute names are in the existingAttributes
    if (attributeNames.some((name: string) => !existingAttributes.some((attribute: any) => attribute.name === name))) {
      return NextResponse.json({ error: "New attribute name cannot be created" }, { status: 400 });
    }

    const contact = await prisma.whatsAppRecipient.update({
      where: { id },
      data: {
        name,
        phoneNumber: phoneNumber.replace(/[^\d]/g, ''),
        attributeValues: attributeValues,
      },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error updating contact:", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json()
    const { ids } = body // expects an array of ids

    const contacts = await prisma.whatsAppRecipient.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("Error deleting contact:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}