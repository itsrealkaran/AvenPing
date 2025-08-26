import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/jwt";

interface JWTPayload {
  id: string;
  role: string;
  companyId?: string;
  exp: number;
  hasWhatsAppAccount?: boolean;
  signupStatus?: string;
}

// List of public routes that don't require authentication
const publicRoutes = [
  '/signup',
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
  '/profile',
  '/aibot-lock'
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
  '/profile'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAIBotRoute = pathname === '/aibot' || pathname.startsWith('/aibot/');
  
  
  try {
    const session = await getSessionFromRequest(request);
    
    // Allow public routes without any checks
    if (publicRoutes.some((route) => pathname.startsWith(route))) {
      
      
      if (session && pathname.startsWith("/login")) {
        const url = new URL('/dashboard', request.url);
        const redirectResponse = NextResponse.redirect(url);
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }
      return NextResponse.next();
    }

    if (pathname.startsWith('/api')) return NextResponse.next();
    console.log(session, "session from middleware");
    
    if (session && session.signupStatus === 'REGISTERED' && !pathname.startsWith('/signup') ) {
      const url = new URL('/signup?status=registered', request.url);
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    } else if (session && session.signupStatus === 'PAID' && !pathname.startsWith('/signup')) {
      const url = new URL('/signup?status=paid', request.url);
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.headers.set('x-middleware-cache', 'no-cache');
      return redirectResponse;
    }

    // Check if the current path requires authentication
    const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route));
  
    if (!requiresAuth) {
      // If it's not a protected route, proceed normally
      return NextResponse.next();
    }

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

      console.log(session.plan);
      if (session.plan !== 'ENTERPRISE' && isAIBotRoute) {
        const url = new URL('/aibot-lock', request.url);
        const redirectResponse = NextResponse.redirect(url);
        redirectResponse.headers.set('x-middleware-cache', 'no-cache');
        return redirectResponse;
      }

      if (session.plan === "BASIC" && pathname.startsWith('/flows')) {
        const url = new URL('/flow-lock', request.url);
        const redirectResponse = NextResponse.redirect(url);
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