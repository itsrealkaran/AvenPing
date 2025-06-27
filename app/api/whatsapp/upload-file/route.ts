import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getSession } from '@/lib/jwt';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const user = await getSession();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the base URL from the request
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;

    // First, get the upload session
    const uploadSession = await axios.post(`${baseUrl}/api/whatsapp/upload-session`, {
      file_name: file.name,
      file_length: file.size,
      file_type: file.type,
      userId: user.userId as string,
    });

    const uploadSessionId = uploadSession.data.id;
    const accessToken = uploadSession.data.accessToken;
    console.log(accessToken, "accessToken");
    console.log(uploadSessionId, "uploadSessionId");

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to WhatsApp Business API
    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v23.0/upload:${uploadSessionId}`,
      buffer,
      {
        headers: {
          'Authorization': `OAuth ${accessToken}`,
          'file_offset': '0',
        },
      }
    );
    console.log(uploadResponse.data);

    return NextResponse.json(uploadResponse.data);
  } catch (error) {
    console.error('Error in upload-file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 