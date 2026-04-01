import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Book } from '@/models/Book'
import { compressDataUri, decompressDataUri, decompressData } from '@/lib/compression'

export async function GET() {
  try {
    await connectToDatabase()
    // Use .lean() for plain JS objects - avoids Mongoose document overhead
    const raw = await Book.find({}).sort({ createdAt: -1 }).lean()

    const items = raw.map((item: any) => ({
      ...item,
      // .lean() skips Mongoose getters, so we decompress all fields manually:
      description: decompressData(item.description),
      base64Image: decompressDataUri(item.base64Image),
      base64Pdf: decompressDataUri(item.base64Pdf),
    }))

    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error: any) {
    console.error('GET /api/admin/books error:', error.message, error.stack)
    return NextResponse.json({ success: false, message: 'Failed to fetch items', error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    await connectToDatabase()

    // Compress binary fields before storing
    const bookData = {
      ...data,
      base64Image: data.base64Image ? compressDataUri(data.base64Image) : '',
      base64Pdf: data.base64Pdf ? compressDataUri(data.base64Pdf) : '',
    }

    const newItem = await Book.create(bookData)
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/books error:', error)
    return NextResponse.json({ success: false, message: 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await connectToDatabase()
    await Book.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/books error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
