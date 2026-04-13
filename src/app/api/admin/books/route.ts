import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Book } from '@/models/Book'
import { compressDataUri, decompressDataUri, decompressData } from '@/lib/compression'

export async function GET() {
  try {
    await connectToDatabase()
    const raw = await Book.find({}).sort({ createdAt: -1 }).lean()

    const items = raw.map((item: any) => ({
      ...item,
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
  let data: any
  try { data = await request.json() }
  catch { return NextResponse.json({ success: false, message: 'Request body too large or malformed. Please reduce image/PDF size.' }, { status: 413 }) }
  try {
    await connectToDatabase()

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

export async function PUT(request: Request) {
  let data: any
  try { data = await request.json() }
  catch { return NextResponse.json({ success: false, message: 'Request body too large or malformed. Please reduce image/PDF size.' }, { status: 413 }) }
  try {
    await connectToDatabase()
    const { id, base64Image, base64Pdf, ...rest } = data

    const updateData: any = { ...rest }
    if (base64Image && base64Image.startsWith('data:')) {
      updateData.base64Image = compressDataUri(base64Image)
    }
    if (base64Pdf && base64Pdf.startsWith('data:')) {
      updateData.base64Pdf = compressDataUri(base64Pdf)
    }

    const updated = await Book.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
    return NextResponse.json({ success: true, item: updated }, { status: 200 })
  } catch (error) {
    console.error('PUT /api/admin/books error:', error)
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    await connectToDatabase()
    if (body.ids && Array.isArray(body.ids)) {
      await Book.deleteMany({ _id: { $in: body.ids } })
    } else {
      await Book.findByIdAndDelete(body.id)
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/books error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
