import { NextRequest, NextResponse } from 'next/server'
import { createReadStream, statSync, existsSync } from 'fs'
import { join } from 'path'

// Video mapping - obfuscate real filenames
const VIDEO_MAP: Record<string, string> = {
  'hero-1': 'hero-video.mp4',
  'hero-2': 'hero-video-2.mp4',
}

/** The host the client actually addressed, honouring a TLS/proxy hop. */
function getRequestHost(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-host')
  const host = forwarded?.split(',')[0].trim() || request.headers.get('host')
  return host ? host.toLowerCase() : null
}

/** Optional extra hosts (CDN, staging alias), comma-separated. */
function extraAllowedHosts(): string[] {
  return (process.env.MEDIA_ALLOWED_HOSTS ?? '')
    .split(',')
    .map(h => h.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Anti-hotlinking check for a PUBLIC marketing video.
 *
 * This used to compare the referer against a hardcoded list of origins
 * (newatlantic.vn / localhost:3000). Any other origin — the LAN IP the server
 * prints, a staging alias, a different port, or the real domain served over
 * plain HTTP — got a 403, so the hero video silently vanished in production.
 *
 * Comparing against the request's OWN host instead makes this work on every
 * origin the site is actually served from, while still refusing embeds from a
 * different site (which is the only thing the check was ever buying).
 *
 * A missing Referer/Origin is allowed: privacy modes and some media requests
 * omit it, and its absence is not evidence of hotlinking.
 */
function isSameSiteMediaRequest(request: NextRequest): boolean {
  const source = request.headers.get('referer') || request.headers.get('origin')
  if (!source) return true

  let sourceHost: string
  try {
    sourceHost = new URL(source).host.toLowerCase()
  } catch {
    // Unparseable header — treat as absent rather than hostile.
    return true
  }

  const selfHost = getRequestHost(request)
  if (selfHost && sourceHost === selfHost) return true

  return extraAllowedHosts().includes(sourceHost)
}

function createSafeWebStream(videoPath: string, start?: number, end?: number): ReadableStream<Uint8Array> {
  const nodeStream = createReadStream(videoPath, start !== undefined && end !== undefined ? { start, end } : undefined)
  let isClosed = false

  const closeStream = () => {
    if (isClosed) return
    isClosed = true
    nodeStream.destroy()
  }

  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on('data', (chunk: string | Buffer) => {
        if (isClosed) return

        try {
          const bufferChunk = typeof chunk === 'string' ? Buffer.from(chunk) : chunk
          controller.enqueue(new Uint8Array(bufferChunk))
        } catch {
          closeStream()
        }
      })

      nodeStream.on('end', () => {
        if (isClosed) return
        isClosed = true
        try {
          controller.close()
        } catch {
          // Stream can already be closed when client cancels request.
        }
      })

      nodeStream.on('error', (error) => {
        if (isClosed) return
        isClosed = true
        try {
          controller.error(error)
        } catch {
          // Ignore if controller is already closed.
        }
      })
    },
    cancel() {
      closeStream()
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    // Get video ID from query
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get('id')

    if (!videoId || !VIDEO_MAP[videoId]) {
      return new NextResponse('Video not found', { status: 404 })
    }

    // Anti-hotlinking. Runs in every environment: it is host-relative now, so it
    // cannot produce the "works in dev, 403 in production" split that hid the
    // original bug.
    if (!isSameSiteMediaRequest(request)) {
      return new NextResponse('Forbidden', { status: 403 })
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

      if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end < start || end >= fileSize) {
        return new NextResponse('Invalid range', {
          status: 416,
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        })
      }

      const chunkSize = end - start + 1

      const webStream = createSafeWebStream(videoPath, start, end)

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
    const webStream = createSafeWebStream(videoPath)

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
