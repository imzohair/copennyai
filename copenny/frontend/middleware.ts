import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Extract token from cookies
  const token = request.cookies.get('auth_token')?.value;
  
  // Public paths that do not require authentication
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
                     
  if (!token && !isAuthPage) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && isAuthPage) {
    // Redirect authenticated users away from login/register to dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except API routes, static assets, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
