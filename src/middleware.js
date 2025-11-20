import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the user is authenticated
  const isAuthenticated = request.cookies.get('swiftflow-auth');
  
  // If the user is not authenticated and is trying to access a protected route
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Redirect to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
