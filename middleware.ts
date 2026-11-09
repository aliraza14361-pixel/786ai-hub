import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return new NextResponse('Auth Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
