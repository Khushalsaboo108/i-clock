/**
 * Next.js Proxy (formerly Middleware)
 * Protects routes - redirects to login if not authenticated
 * 
 * Note: Next.js 16 renames middleware.ts to proxy.ts
 * The proxy handles light interception tasks like rewrites, redirects, and headers
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Get the access token from cookies
  const accessToken = request.cookies.get("access_token")?.value

  // If user is not authenticated and trying to access a protected route
  if (!accessToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
