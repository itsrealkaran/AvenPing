import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/jwt'
import { notify } from '@/lib/notification-utils'

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
        },
        include: {
          settings: true,
        },
    })

    if (user.settings?.notificationSettings?.some((setting: any) => setting.notificationType === 'systemUpdates' && setting.isEnabled)) {
      await notify.whatsappDisconnected(user.id);
    }

    return NextResponse.json({message: 'WhatsApp account disconnected successfully'}, {status: 200})
  }
  catch (error) {
    return NextResponse.json({error: 'Internal server error'}, {status: 500})
  }
}