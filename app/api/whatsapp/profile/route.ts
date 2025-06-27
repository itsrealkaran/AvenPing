import { getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
    const session = await getSession();
    
    if (!session?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phoneNumberId = searchParams.get('phoneNumberId');

    if (!phoneNumberId) {
        return NextResponse.json({ error: 'Phone number ID is required' }, { status: 400 });
    }

    const account = await prisma.whatsAppAccount.findFirst({
        where: {
            user: {
                email: session.email
            }
        },
    });

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    try {
        const profile = await axios.get(
            `https://graph.facebook.com/v22.0/${phoneNumberId}/whatsapp_business_profile`,
            {
                params: {
                    fields: 'about,address,description,email,profile_picture_url,websites',
                    access_token: account.accessToken
                }
            }
        );
        return NextResponse.json(profile.data.data[0]);
    } catch (error: any) {
        console.error('WhatsApp API Error:', error.response?.data || error.message);
        if (error.response?.status === 400) {
            return NextResponse.json({ 
                error: 'Invalid phone number ID or insufficient permissions',
                details: error.response?.data
            }, { status: 400 });
        }
        throw error;
    }
    } catch (error) {
        console.error('Error fetching profile', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
    const session = await getSession();
    
    if (!session?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const phoneNumberId = searchParams.get('phoneNumberId');

    if (!phoneNumberId) {
        return NextResponse.json({ error: 'Phone number ID is required' }, { status: 400 });
    }
    const body = await request.json();
    const { about, address, description, email, profile_picture_url, websites  } = body;

    const account = await prisma.whatsAppAccount.findFirst({
        where: {
            user: {
                email: session.email
            }
        }
    });

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // console.log(about, address, description, email, profile_picture_url, websites);
    const profile = await axios.post(
        `https://graph.facebook.com/v22.0/${phoneNumberId}/whatsapp_business_profile`,
        {
            about,
            address,
            description,
            email,
            profile_picture_url,
            websites,
            messaging_product: 'whatsapp',
        },
        {
            params: {
                access_token: account.accessToken
            }
        }
    );

    return NextResponse.json(profile.data);
    } catch (error) {
        console.error('Error updating profile', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}