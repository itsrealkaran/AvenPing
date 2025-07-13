import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const whatsAppAccountId = formData.get('userId') as string; // Using userId field for WhatsApp account ID

    if (!file || !whatsAppAccountId) {
      return NextResponse.json({ 
        error: "File and WhatsApp account ID are required" 
      }, { status: 400 });
    }

    const userAccount = await prisma.whatsAppAccount.findUnique({
      where: {
        id: whatsAppAccountId,
      }
    });

    if (!userAccount) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    console.log(process.env.META_APP_ID, "meta app id")

    // Step 1: Create upload session
    const uploadSession = await axios.post(`https://graph.facebook.com/v23.0/${process.env.META_APP_ID}/uploads`, {
      file_name: file.name,
      file_length: file.size,
      file_type: file.type,
    }, {
      headers: {
        Authorization: `Bearer ${userAccount.accessToken}`,
      },
    });

    const sessionId = uploadSession.data.id;

    // Step 2: Upload the file to the session
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v23.0/${sessionId}`,
      fileBuffer,
      {
        headers: {
          'Authorization': `Bearer ${userAccount.accessToken}`,
          'file_offset': '0',
          'Content-Type': file.type,
        },
      }
    );

    return NextResponse.json({ 
      fileHandle: uploadResponse.data.h,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      sessionId: sessionId
    }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.response) {
      console.error('WhatsApp API error:', error.response.data);
      return NextResponse.json({ 
        error: "WhatsApp API error", 
        details: error.response.data 
      }, { status: error.response.status });
    }
    
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
