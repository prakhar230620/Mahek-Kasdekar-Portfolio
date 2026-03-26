import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'portfoliosecret123')
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      // Invalid token
      console.error('Invalid token', err)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
