import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Timeline from '@/models/Timeline'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDatabase()
    const items = await Timeline.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    const newItem = await Timeline.create(data)
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error: any) {
    console.error('Timeline POST Error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await connectToDatabase()
    await Timeline.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
