import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.userId) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const user = await prisma.user.update({
        where: {id: session.userId as string },
        data: {
          whatsAppAccount: undefined,
          whatsAppAccountId: null
        }
    })

    return NextResponse.json({message: 'WhatsApp account disconnected successfully'}, {status: 200})
  }
  catch (error) {
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}