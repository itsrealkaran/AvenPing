import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/jwt";

// Add paths that should be accessible without authentication
const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/"];
const privatePaths = ["/dashboard", "/api", "/messages", "/campaigns", "/templates", "/contacts", "/flows", "/aibot", "/analytics", "/settings"];

// Paths that require WhatsApp account
const whatsappRequiredPaths = ["/messages", "/campaigns", "/templates", "/contacts", "/flows", "/aibot", "/analytics", "/settings", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if the path starts with /dashboard or /api
  const isProtectedRoute = privatePaths.includes(pathname);

  if (isProtectedRoute) {
    try {
      const session = await getSession();
      
      // If no session exists, redirect to login
      if (!session) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(url);
        response.headers.set("x-middleware-cache", "no-cache");
        return response;
      }

      // Check if the current path requires WhatsApp account
      if (whatsappRequiredPaths.includes(pathname)) {
        console.log("Session from middleware", session);
        // Check WhatsApp account status from JWT token (no API call needed)
        const hasWhatsAppAccount = session.hasWhatsAppAccount === true;
        
        // If user doesn't have WhatsApp account, redirect to dashboard
        if (!hasWhatsAppAccount) {
          const response = NextResponse.redirect(new URL("/dashboard?whatsapp=false", request.url));
          response.headers.set("x-middleware-cache", "no-cache");
          return response;
        }
      }

      // If session exists and WhatsApp check passes, allow the request
      return NextResponse.next();
    } catch (error) {
      // If there's an error checking the session, redirect to login
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      const response = NextResponse.redirect(url);
      response.headers.set("x-middleware-cache", "no-cache");
      return response;
    }
  }

  // For all other routes, allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api/auth|_next|fonts|favicon.ico|sitemap.xml).*)",
  ],
}; 