import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync, existsSync } from 'fs'
import { join } from 'path'
import { Readable } from 'stream'

// Video mapping - obfuscate real filenames
const VIDEO_MAP: Record<string, string> = {
  'hero-1': 'hero-video.mp4',
  'hero-2': 'hero-video-2.mp4',
}

// Allowed origins for referer check
const ALLOWED_ORIGINS = [
  'https://newatlantic.vn',
  'https://www.newatlantic.vn',
  'http://localhost:3000',
  'http://localhost:3001',
]

export async function GET(request: NextRequest) {
  try {
    // Get video ID from query
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId || !VIDEO_MAP[videoId]) {
      return new NextResponse('Video not found', { status: 404 })
    }

    // Referer check - block direct access
    const referer = request.headers.get('referer')
    const origin = request.headers.get('origin')

    // In production, require valid referer
    if (process.env.NODE_ENV === 'production') {
      const isValidReferer = referer && ALLOWED_ORIGINS.some(o => referer.startsWith(o))
      const isValidOrigin = origin && ALLOWED_ORIGINS.includes(origin)

      if (!isValidReferer && !isValidOrigin) {
        return new NextResponse('Forbidden', { status: 403 })
      }
    }

    // Get video path
    const videoFileName = VIDEO_MAP[videoId]
    const videoPath = join(process.cwd(), 'videos', videoFileName)

    // Check if file exists
    if (!existsSync(videoPath)) {
      console.error('Video file not found:', videoPath)
      return new NextResponse('Video not found', { status: 404 })
    }

    // Get file stats
    const stat = statSync(videoPath)
    const fileSize = stat.size

    // Handle range requests for video seeking
    const range = request.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      const stream = createReadStream(videoPath, { start, end })
      const webStream = Readable.toWeb(stream) as ReadableStream

      return new NextResponse(webStream, {
        status: 206,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'private, max-age=3600',
          'X-Content-Type-Options': 'nosniff',
        },
      })
    }

    // Full file response
    const stream = createReadStream(videoPath)
    const webStream = Readable.toWeb(stream) as ReadableStream

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Video streaming error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
