import { getSession } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const phoneNumberId = formData.get("phoneNumberId") as string;
    console.log(phoneNumberId, "phoneNumberId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = originalName.split('.').pop();
    const filename = `${timestamp}_${originalName}`;
    const filePath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Prepare form-data for WhatsApp API
    const waForm = new FormData();
    waForm.append("file", fs.createReadStream(filePath), {
      filename: originalName,
      contentType: file.type,
    });
    waForm.append("type", file.type);
    waForm.append("messaging_product", "whatsapp");

    // Send to WhatsApp API
    const mediaId = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/media`,
      waForm,
      {
        headers: {
          ...waForm.getHeaders(),
          Authorization: `Bearer ${account.accessToken}`,
        },
      }
    );

    // Clean up: delete the file from server
    try {
      unlinkSync(filePath);
    } catch (e) {
      console.warn("Failed to delete uploaded file after WhatsApp upload", e);
    }

    return NextResponse.json({ 
      mediaId: mediaId.data.id,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({ error: "File upload failed", message: error }, { status: 500 });
  }
} 