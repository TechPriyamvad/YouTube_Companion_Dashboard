import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { title, description } = body

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Generate 3 creative alternative titles for a YouTube video with the current title: "${title}". Description: "${description}". Return only 3 titles, one per line, without numbering.`,
        },
      ],
      max_tokens: 200,
    })

    const suggestions = (response.choices[0].message.content || '')
      .split('\n')
      .filter((s) => s.trim())
      .slice(0, 3)

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
