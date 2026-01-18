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
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${VIDEO_ID}&maxResults=20&key=${YOUTUBE_API_KEY}`
    )

    const comments = response.data.items.map((thread: any) => ({
      id: thread.id,
      authorName: thread.snippet.topLevelComment.snippet.authorDisplayName,
      text: thread.snippet.topLevelComment.snippet.textDisplay,
      likes: thread.snippet.topLevelComment.snippet.likeCount,
      publishedAt: thread.snippet.topLevelComment.snippet.publishedAt,
    }))

    return NextResponse.json({ comments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { text } = body

    const response = await axios.post(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=${YOUTUBE_API_KEY}`,
      {
        snippet: {
          videoId: VIDEO_ID,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      }
    )

    return NextResponse.json({ success: true, commentId: response.data.id }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to post comment' },
      { status: 500 }
    )
  }
}
