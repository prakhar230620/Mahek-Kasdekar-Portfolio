import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Message } from '@/models/Message'

export async function GET() {
  try {
    await connectToDatabase()
    const messages = await Message.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, messages }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch messages' }, { status: 500 })
  }
}
