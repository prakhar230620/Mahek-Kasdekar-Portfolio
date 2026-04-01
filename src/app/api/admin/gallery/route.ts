import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { GalleryItem } from '@/models/GalleryItem'
import { compressDataUri, decompressDataUri } from '@/lib/compression'

export async function GET() {
  try {
    await connectToDatabase()
    // Use .lean() to get plain JS objects, avoiding Mongoose document overhead
    const raw = await GalleryItem.find({}).sort({ createdAt: -1 }).lean()

    const items = raw.map((item: any) => ({
      ...item,
      // Decompress binary field back to data URI for the frontend
      base64Image: decompressDataUri(item.base64Image),
    }))

    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()

    // Compress binary fields before storing
    const itemData = {
      ...data,
      base64Image: data.base64Image ? compressDataUri(data.base64Image) : '',
    }

    const newItem = await GalleryItem.create(itemData)
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await connectToDatabase()
    await GalleryItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
