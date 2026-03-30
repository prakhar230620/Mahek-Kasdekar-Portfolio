import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { PortfolioItem } from '@/models/PortfolioItem'

export const dynamic = 'force-dynamic'
import { GalleryItem } from '@/models/GalleryItem'
import { Message } from '@/models/Message'
import { Book } from '@/models/Book'
import Timeline from '@/models/Timeline'

export async function GET() {
  try {
    await connectToDatabase()

    const portfolioCount = await PortfolioItem.countDocuments()
    const galleryCount = await GalleryItem.countDocuments()
    const messageCount = await Message.countDocuments()
    const bookCount = await Book.countDocuments()
    const timelineCount = await Timeline.countDocuments()

    return NextResponse.json({
      success: true,
      data: {
        portfolio: portfolioCount,
        gallery: galleryCount,
        messages: messageCount,
        books: bookCount,
        timeline: timelineCount,
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
