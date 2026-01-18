import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const VIDEO_ID = process.env.YOUTUBE_VIDEO_ID || ''

export async function GET(req: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
    }

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${VIDEO_ID}&key=${YOUTUBE_API_KEY}`
    )

    const video = response.data.items[0]
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.default.url,
      views: video.statistics.viewCount,
      likes: video.statistics.likeCount || 0,
      commentCount: video.statistics.commentCount || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { title, description } = body

    const response = await axios.put(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${YOUTUBE_API_KEY}`,
      {
        id: VIDEO_ID,
        snippet: {
          title,
          description,
          categoryId: '24',
        },
      }
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update video' },
      { status: 500 }
    )
  }
}
