import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { PortfolioItem } from '@/models/PortfolioItem'
import { compressDataUri, decompressDataUri, decompressData } from '@/lib/compression'

export async function GET() {
  try {
    await connectToDatabase()
    // Use .lean() to get plain JS objects, avoiding Mongoose document overhead
    const raw = await PortfolioItem.find({}).sort({ createdAt: -1 }).lean()

    const items = raw.map((item: any) => ({
      ...item,
      // .lean() skips Mongoose getters, so we decompress all fields manually:
      description: decompressData(item.description),
      base64Image: decompressDataUri(item.base64Image),
    }))

    return NextResponse.json({ success: true, items }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/portfolio error:', error)
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

    const newItem = await PortfolioItem.create(itemData)
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/portfolio error:', error)
    return NextResponse.json({ success: false, message: 'Failed to create item' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await connectToDatabase()
    await PortfolioItem.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/admin/portfolio error:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 })
  }
}
