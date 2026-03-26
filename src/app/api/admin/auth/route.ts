import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validate credentials against environment variables
    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'password'

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'portfoliosecret123')
    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    // Set HTTP-only cookie
    const response = NextResponse.json({ success: true }, { status: 200 })
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Auth Api Error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 })
  }
}
