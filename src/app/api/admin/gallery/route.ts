import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { GalleryItem } from '@/models/GalleryItem'
import { compressDataUri, decompressDataUri } from '@/lib/compression'

export async function GET() {
  try {
    await connectToDatabase()
    const raw = await GalleryItem.find({}).sort({ createdAt: -1 }).lean()

    const items = raw.map((item: any) => ({
      ...item,
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

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()
    const { id, base64Image, ...rest } = data

    const updateData: any = { ...rest }
    if (base64Image && base64Image.startsWith('data:')) {
      updateData.base64Image = compressDataUri(base64Image)
    }

    const updated = await GalleryItem.findByIdAndUpdate(id, updateData, { new: true })
    return NextResponse.json({ success: true, item: updated }, { status: 200 })
  } catch (error) {
    console.error('PUT /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()
    if (body.ids && Array.isArray(body.ids)) {
      await GalleryItem.deleteMany({ _id: { $in: body.ids } })
    } else {
      await GalleryItem.findByIdAndDelete(body.id)
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/gallery error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
