import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import axios from 'axios';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const whatsappAccounts = await prisma.whatsAppAccount.findMany({
      where: {
        user: {
          email: session.email
        }
      },
      include: {
        phoneNumbers: true
      }
    });

    return NextResponse.json(whatsappAccounts);
  } catch (error) {
    console.error('Error fetching WhatsApp accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch WhatsApp accounts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // wabaid, accessToken, displayName, phoneNumberData = [ {phoneNumberId: string, name: string, phoneNumber: string, codeVerificationStatus: string} ]
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // const accessToken = await getAccessToken(code);
    // console.log("accessToken", accessToken);

    // if (!accessToken) {
    //   return NextResponse.json(
    //     { error: 'Failed to get access token' },
    //     { status: 500 }
    //   );
    // }

    const userInfo = await getUserInfo(code);
    console.log("userInfo", userInfo);
    const user = await prisma.user.findUnique({
      where: { email: session.email as string }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const whatsappAccount = await prisma.whatsAppAccount.create({
      data: {
        user: { connect: { id: user.id } },
        wabaid: userInfo.wabaid,
        accessToken: userInfo.accessToken,
        displayName: userInfo.displayName,
        phoneNumbers: {
          createMany: {
            data: userInfo.phoneNumberData.map((phoneNumber: any) => ({
              phoneNumberId: phoneNumber.phoneNumberId,
              phoneNumber: phoneNumber.phoneNumber,
              name: phoneNumber.name,
            })),
          },
        },
      },
    });

    return NextResponse.json(whatsappAccount, { status: 201 });
  } catch (error) {
    console.error('Error creating WhatsApp account:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: 'Failed to create WhatsApp account' },
      { status: 500 }
    );
  }
}

async function getAccessToken(code: string) {
  try {
    for (let i = 0; i < 3; i++) {
      try {
        console.log("app id", process.env.META_APP_ID, "client secret", process.env.META_CLIENT_SECRET, "code", code);
        const response = await fetch(
          `https://graph.facebook.com/v23.0/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_CLIENT_SECRET}&code=${code}`,
        );
        const data: any = await response.json();
        console.log(data, 'data from get access token');
        return data.access_token;
      } catch (error: any) {
        console.error('Facebook API Error:', error);
      }
    }
    return null;
  } catch (error: any) {
    console.error('Facebook API Error:', error.message);
    return null;
  }
}

const getUserInfo = async (accessToken: string) => {
  try {
    const userInfo = await axios.get(`https://graph.facebook.com/v23.0/me?access_token=${accessToken}`);
    console.log('User info:', userInfo.data);

    const debugInfo = await axios.get(
      `https://graph.facebook.com/v23.0/debug_token?input_token=${accessToken}&access_token=${process.env.META_APP_ID}`
    );
    console.log('Debug info:', JSON.stringify(debugInfo.data, null, 2));

    const wabaId = debugInfo.data.data.granular_scopes.find(
      (scope: any) => scope.scope === 'whatsapp_business_management'
    )?.target_ids[0];

    const phoneNumbers = await axios.get(
      `https://graph.facebook.com/v23.0/${wabaId}/phone_numbers?access_token=${accessToken}`
    );
    console.log('Phone numbers:', phoneNumbers.data);

    const phoneNumberData = phoneNumbers.data.data.map((phoneNumber: any) => ({
      phoneNumberId: phoneNumber.id,
      name: phoneNumber.verified_name,
      phoneNumber: phoneNumber.display_phone_number,
      codeVerificationStatus: phoneNumber.code_verification_status,
    }));

    const phoneNumberIds = phoneNumberData.map(
      (phoneNumber: any) => phoneNumber.phoneNumberId
    );

    return {
      displayName: userInfo.data.name,
      phoneNumberData,
      phoneNumberIds,
      wabaid: wabaId,
      accessToken,
    };
  } catch (error) {
    console.error('Error:', JSON.stringify(error, null, 2));
    throw error;
  }
};