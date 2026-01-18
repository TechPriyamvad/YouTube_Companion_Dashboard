import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Note } from '@/lib/models'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const searchParams = req.nextUrl.searchParams
    const q = searchParams.get('q') || ''

    let query = {}
    if (q) {
      query = {
        $or: [{ content: { $regex: q, $options: 'i' } }, { tags: { $regex: q, $options: 'i' } }],
      }
    }

    const notes = await Note.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const note = await Note.create({
      videoId: process.env.YOUTUBE_VIDEO_ID || 'default',
      content: body.content,
      tags: body.tags || '',
    })
    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
