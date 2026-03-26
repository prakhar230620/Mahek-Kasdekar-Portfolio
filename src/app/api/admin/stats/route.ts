import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { PortfolioItem } from '@/models/PortfolioItem'
import { GalleryItem } from '@/models/GalleryItem'
import { Message } from '@/models/Message'

export async function GET() {
  try {
    await connectToDatabase()

    const portfolioCount = await PortfolioItem.countDocuments()
    const galleryCount = await GalleryItem.countDocuments()
    const messageCount = await Message.countDocuments()

    return NextResponse.json({
      success: true,
      data: {
        portfolio: portfolioCount,
        gallery: galleryCount,
        messages: messageCount,
      },
    })
  } catch (error: any) {
    console.error('Stats API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
