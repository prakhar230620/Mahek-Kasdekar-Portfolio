import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Timeline from '@/models/Timeline'

export async function GET() {
  try {
    await connectToDatabase()
    // Sort by explicit `order` field first, then by creation date as fallback
    const items = await Timeline.find({}).sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    // Auto-assign order: place at the end
    const count = await Timeline.countDocuments()
    const newItem = await Timeline.create({ ...data, order: count })
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error: any) {
    console.error('Timeline POST Error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create item' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()

    // Bulk reorder: [{ id, order }, ...]
    if (Array.isArray(data)) {
      await Promise.all(
        data.map(({ id, order }: { id: string; order: number }) =>
          Timeline.findByIdAndUpdate(id, { order })
        )
      )
      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Single item update
    const { id, ...updateData } = data
    const updated = await Timeline.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    return NextResponse.json({ success: true, item: updated }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()
    // Support bulk delete via `ids` array, or single `id`
    if (body.ids && Array.isArray(body.ids)) {
      await Timeline.deleteMany({ _id: { $in: body.ids } })
    } else {
      await Timeline.findByIdAndDelete(body.id)
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
