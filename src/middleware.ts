import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Demo mode session checks can be handled here or inside specific route layouts
  // Example dummy auth check for demo purposes
  const isVendorRoute = request.nextUrl.pathname.startsWith('/vendor');
  const isCustomerRoute = request.nextUrl.pathname.startsWith('/customer');
  const isRunnerRoute = request.nextUrl.pathname.startsWith('/runner');

  // In a real app we would decode the firebase auth token here and check custom claims
  const roleCookie = request.cookies.get('demo_role')?.value;

  if (isVendorRoute && roleCookie !== 'vendor') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (isCustomerRoute && roleCookie !== 'customer') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isRunnerRoute && roleCookie !== 'runner') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/customer/:path*', '/runner/:path*'],
}
