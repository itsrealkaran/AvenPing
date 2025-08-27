import { createToken, getSession } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: session.userId as string },
      data: {
        signupStatus: "COMPLETED",
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    session.signupStatus = "COMPLETED";

    const token = await createToken(session);
  
    // Set cookie
    const response = NextResponse.json(
      {
        signupStatus: user.signupStatus
      },
      { status: 200 }
    );

    response.cookies.set('Authorization', token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      maxAge: 60 * 60 * 24 // 24 hours
    });
  
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}