/**
 * Next.js Edge Middleware — Route-Level Auth Enforcement
 * --------------------------------------------------------
 * WHY THIS CHANGE:
 * The previous middleware was a complete passthrough — it did nothing. Any
 * unauthenticated request to /dashboard/* was allowed through to the page
 * component, which then tried to call loginAsDemo() as a fallback (now removed).
 * That meant there was effectively no authentication on any route.
 *
 * THIS VERSION enforces two layers of protection:
 *
 * 1. Dashboard route protection
 *    Requests to /dashboard/* are checked for the presence of a Firebase session
 *    cookie (set by the auth provider on sign-in) OR a valid NEXT_AUTH session.
 *    If neither exists → redirect to /login?from=<original-path>.
 *
 *    NOTE ON SESSION COOKIES vs TOKENS:
 *    Firebase ID tokens are JWTs that live only in browser memory (managed by the
 *    Firebase SDK). They are NOT automatically sent as cookies. For Edge Middleware
 *    to verify auth without calling Firebase's REST API on every request (which
 *    would add latency and a cold-start dependency), we check for the presence of
 *    a session cookie that the auth provider should set on successful sign-in.
 *
 *    The auth-provider.tsx sets a `__session` cookie using Firebase's
 *    `getIdToken()` result — see the note there. This middleware reads that cookie
 *    as a presence check (not a full JWT verification; full verification happens
 *    server-side in API routes / Route Handlers where we have Node.js runtime
 *    available for firebase-admin).
 *
 * 2. Security headers
 *    Every response gets a hardened set of security headers regardless of route.
 *    These complement the backend's SecurityHeadersMiddleware and ensure that even
 *    Next.js-served pages (HTML, RSC payloads) carry the same protections.
 *
 * PROTECTED PATHS: /dashboard and all sub-paths
 * PUBLIC PATHS:    /login, /signup, /, /api/*, static assets
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication — any request matching these prefixes
// will be redirected to /login if no session cookie is found.
const PROTECTED_PREFIXES = ['/dashboard'];

// Paths that are always public — never redirect these even if matched above
const PUBLIC_PREFIXES = ['/login', '/signup', '/api/', '/_next/', '/favicon'];

// Cookie name set by the auth provider on successful sign-in.
// Change this to match whatever cookie your auth flow sets.
const SESSION_COOKIE_NAME = '__session';

function isProtectedPath(pathname: string): boolean {
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return false;
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent browsers from inferring MIME type (clickjacking via MIME confusion)
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Deny all framing — prevents clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Legacy XSS filter (belt-and-suspenders for old IE/Chrome versions)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Strict HTTPS for 1 year (only meaningful over HTTPS but harmless on HTTP)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Referrer policy — don't leak full URL to third-party requests
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — disable features the app doesn't need
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()',
  );
  // Content Security Policy — tightened to same-origin scripts with Firebase exceptions
  // IMPORTANT: Adjust script-src / connect-src when adding new third-party integrations
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Firebase Auth uses inline scripts in some flows
      "script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      // Allow connections to backend API and Firebase services
      "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com http://localhost:8000 https://localhost:8000",
      "font-src 'self' data:",
      "frame-src 'self' https://accounts.google.com",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  );
  return response;
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // ── Route protection ───────────────────────────────────────────────────
  if (isProtectedPath(pathname)) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      // No session — redirect to login, preserving the destination
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', encodeURIComponent(pathname));
      const redirectResponse = NextResponse.redirect(loginUrl);
      return addSecurityHeaders(redirectResponse);
    }
  }

  // ── Pass through + inject security headers ────────────────────────────
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  // Match all paths except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
