import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Default Admin Credentials: Username: admin | Password: 786aihubpass
    const validAuth = 'Basic ' + Buffer.from('admin:786aihubpass').toString('base64');

    if (authHeader !== validAuth) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure 786 AI Admin Panel"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
