"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

interface LazyVideoBackgroundProps {
  videoSrc: string
  posterImage?: string
  className?: string
  fallbackVideoSrc?: string
}

export default function LazyVideoBackground({
  videoSrc,
  posterImage,
  className = "",
  fallbackVideoSrc
}: LazyVideoBackgroundProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(videoSrc)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const retryCountRef = useRef(0)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const maxRetries = 2

  // Reset state when videoSrc prop changes
  useEffect(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    setCurrentSrc(videoSrc)
    retryCountRef.current = 0
    setHasError(false)
    setIsLoaded(false)
  }, [videoSrc])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '300px',
        threshold: 0
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleVideoError = useCallback((event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    const currentRetry = retryCountRef.current
    const mediaError = event.currentTarget.error

    if (process.env.NODE_ENV === 'development') {
      console.warn(`Video load failed (attempt ${currentRetry + 1}):`, currentSrc, {
        code: mediaError?.code,
        message: mediaError?.message
      })
    }

    if (currentRetry < maxRetries) {
      // True exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, currentRetry)
      retryTimeoutRef.current = setTimeout(() => {
        retryCountRef.current = currentRetry + 1
        if (videoRef.current) {
          videoRef.current.load()
        }
      }, delay)
    } else if (fallbackVideoSrc && currentSrc !== fallbackVideoSrc) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Trying fallback video:', fallbackVideoSrc)
      }
      setCurrentSrc(fallbackVideoSrc)
      retryCountRef.current = 0
    } else {
      setHasError(true)
      setIsLoaded(false)
    }
  }, [currentSrc, fallbackVideoSrc])

  useEffect(() => {
    if (shouldLoad && videoRef.current && !hasError) {
      videoRef.current.load()
    }
  }, [shouldLoad, hasError, currentSrc])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {posterImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterImage})` }}
        />
      )}

      {shouldLoad && !hasError && (
        <video
          ref={videoRef}
          key={currentSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => {
            setIsLoaded(true)
            setHasError(false)
          }}
          onError={handleVideoError}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.5s ease' }}
        >
          <source src={currentSrc} type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/75"></div>
    </div>
  )
}
