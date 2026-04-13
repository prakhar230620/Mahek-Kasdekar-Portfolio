import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Settings } from '@/models/Settings'
import { compressDataUri, decompressDataUri } from '@/lib/compression'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    await connectToDatabase()
    
    if (key) {
      const setting = await Settings.findOne({ key }).lean()
      if (!setting) return NextResponse.json({ success: true, value: null }, { status: 200 })
      
      const val = setting.value
      // If it's an image, decompress
      const finalVal = key.toLowerCase().includes('image') && val ? decompressDataUri(val) : val
      return NextResponse.json({ success: true, value: finalVal }, { status: 200 })
    }

    const raw = await Settings.find({}).lean()
    const settings = raw.reduce((acc: any, item: any) => {
      acc[item.key] = item.key.toLowerCase().includes('image') && item.value ? decompressDataUri(item.value) : item.value
      return acc
    }, {})

    return NextResponse.json({ success: true, settings }, { status: 200 })
  } catch (error) {
    console.error('GET /api/admin/settings error:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  let data: any
  try { data = await request.json() }
  catch { return NextResponse.json({ success: false, message: 'Request body too large.' }, { status: 413 }) }
  
  try {
    await connectToDatabase()
    const { key, value } = data

    if (!key) return NextResponse.json({ success: false, message: 'Key is required' }, { status: 400 })

    let finalValue = value
    if (key.toLowerCase().includes('image') && value && value.startsWith('data:')) {
      finalValue = compressDataUri(value)
    }

    const updated = await Settings.findOneAndUpdate(
      { key },
      { value: finalValue },
      { new: true, upsert: true, runValidators: true }
    )

    revalidatePath('/') // Instantly invalidate main portfolio cache

    return NextResponse.json({ success: true, setting: updated }, { status: 200 })
  } catch (error) {
    console.error('POST /api/admin/settings error:', error)
    return NextResponse.json({ success: false, message: 'Failed to save setting' }, { status: 500 })
  }
}
