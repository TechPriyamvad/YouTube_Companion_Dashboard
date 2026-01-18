import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { EventLog } from '@/lib/models'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const logs = await EventLog.find().sort({ timestamp: -1 }).limit(100)
    return NextResponse.json({ logs })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const log = await EventLog.create({
      action: body.action,
      metadata: body.metadata || {},
      status: 'success',
    })
    return NextResponse.json({ log }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}
