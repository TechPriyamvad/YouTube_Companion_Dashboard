import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
    }

    await axios.delete(
      `https://www.googleapis.com/youtube/v3/comments?id=${params.id}&key=${YOUTUBE_API_KEY}`
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
