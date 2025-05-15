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

    // Convert the file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to WhatsApp Business API
    const uploadResponse = await axios.post(
      `https://graph.facebook.com/v22.0/${uploadSessionId}`,
      buffer,
      {
        headers: {
          'Authorization': `OAuth ${uploadSession.data.accessToken}`,
          'file_offset': '0',
          'Content-Type': file.type,
        },
      }
    );

    return NextResponse.json(uploadResponse.data);
  } catch (error) {
    console.error('Error in upload-file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 