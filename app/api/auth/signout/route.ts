import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Signout successful" }, { status: 200 });
    response.cookies.delete("token");
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Signout failed" }, { status: 500 });
  }
}