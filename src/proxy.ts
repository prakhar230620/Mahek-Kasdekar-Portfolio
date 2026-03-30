import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (
    (pathname.startsWith('/admin') && pathname !== '/admin/login') ||
    (pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth')
  ) {
    const token = request.cookies.get('admin_token')?.value
    
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'portfoliosecret123')
      await jwtVerify(token, secret)
      return NextResponse.next()
    } catch (err) {
      // Invalid token
      console.error('Invalid token, redirecting to login', err)
      
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
      }
      
      // Redirect to login AND clear the invalid cookie
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_token')
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
}
