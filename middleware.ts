import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/jwt";

interface JWTPayload {
  id: string;
  role: string;
  companyId?: string;
  exp: number;
  hasWhatsAppAccount?: boolean;
}

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/pricing',
  '/privacy-policy',
  '/terms-of-service'
];

// List of protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/messages',
  '/campaigns',
  '/templates',
  '/contacts',
  '/flows',
  '/aibot',
  '/analytics',
  '/settings',
  '/profile'
];

// Routes that require WhatsApp account
const whatsappRequiredRoutes = [
  '/messages',
  '/campaigns',
  '/templates',
  '/contacts',
  '/flows',
  '/aibot',
  '/analytics',
  '/settings',
  '/profile'
];

export async function middleware(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    const { pathname } = request.nextUrl;
    
    // Allow public routes without authentication
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      // If user is already authenticated, redirect to dashboard
      try {
        const session = await getSession();
        if (session) {
          const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
          redirectResponse.headers.set('x-middleware-cache', 'no-cache');
          return redirectResponse;
        }
      } catch (error) {
        // Invalid session - allow access to public routes
        const redirectResponse = NextResponse.next();
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }
      
      const redirectResponse = NextResponse.next();
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    }

    // Check if the current path requires authentication
    const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!requiresAuth) {
      // If it's not a protected route, proceed normally
      return NextResponse.next();
    }

    try {
      const session = await getSession();
      
      // If no session exists, redirect to login
      if (!session) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        const redirectResponse = NextResponse.redirect(url);
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }

      // Check if the current path requires WhatsApp account
      const requiresWhatsApp = whatsappRequiredRoutes.some((route) => pathname.startsWith(route));
      
      if (requiresWhatsApp) {
        const hasWhatsAppAccount = session.hasWhatsAppAccount === true;
        
        // If user doesn't have WhatsApp account, redirect to dashboard
        if (!hasWhatsAppAccount) {
          const redirectResponse = NextResponse.redirect(new URL('/dashboard?whatsapp=false', request.url));
          redirectResponse.headers.set('x-middleware-cache', 'no-cache');
          return redirectResponse;
        }
      }

      // If session exists and WhatsApp check passes, allow the request
      return NextResponse.next();
    } catch (error) {
      // If there's an error checking the session, redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    }
  } else if (process.env.NODE_ENV === 'development') {
    const { pathname } = request.nextUrl;

    // Allow access to public routes without authentication
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      try {
        const session = await getSession();
        if (session) {
          // Only redirect if we're on the root path or login page
          if (pathname === '/' || pathname === '/login') {
            const redirectResponse = NextResponse.redirect(new URL('/dashboard', request.url));
            redirectResponse.headers.set('x-middleware-cache', 'no-cache');
            return redirectResponse;
          }
        }
      } catch (error) {
        // Invalid session - allow access to public routes
        const redirectResponse = NextResponse.next();
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }
      
      const redirectResponse = NextResponse.next();
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    }

    // Check if the current path requires authentication
    const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));

    if (!requiresAuth) {
      return NextResponse.next();
    }

    try {
      const session = await getSession();
      
      if (!session) {
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }

      // Check if the current path requires WhatsApp account
      const requiresWhatsApp = whatsappRequiredRoutes.some((route) => pathname.startsWith(route));
      
      if (requiresWhatsApp) {
        const hasWhatsAppAccount = session.hasWhatsAppAccount === true;
        
        // If user doesn't have WhatsApp account, redirect to dashboard
        if (!hasWhatsAppAccount) {
          const redirectResponse = NextResponse.redirect(new URL('/dashboard?whatsapp=false', request.url));
          redirectResponse.headers.set('x-middleware-cache', 'no-cache');
          return redirectResponse;
        }
      }

      // If session exists and WhatsApp check passes, allow the request
      return NextResponse.next();
    } catch (error) {
      const redirectResponse = NextResponse.redirect(new URL('/login', request.url));
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    }
  }
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