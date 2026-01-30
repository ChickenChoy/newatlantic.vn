"use client"

import { useEffect, useRef, useState } from 'react'

interface LazyVideoBackgroundProps {
  videoSrc: string
  posterImage?: string
  className?: string
}

export default function LazyVideoBackground({ 
  videoSrc, 
  posterImage,
  className = "" 
}: LazyVideoBackgroundProps) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Use Intersection Observer to load video only when section is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Start loading video when section is 300px away from viewport
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setShouldLoad(true)
            observer.disconnect() // Stop observing after loading starts
          }
        })
      },
      {
        rootMargin: '300px', // Start loading 300px before section comes into view
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

  useEffect(() => {
    // Load video after shouldLoad is true
    if (shouldLoad && videoRef.current) {
      videoRef.current.load()
      // Try to play after loading
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err)
      })
    }
  }, [shouldLoad])

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Always show poster as background base */}
      {posterImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterImage})` }}
        />
      )}
      
      {/* Video overlay on top */}
      {shouldLoad && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => {
            console.log('Video loaded:', videoSrc)
            setIsLoaded(true)
          }}
          onError={(e) => {
            console.error('Video error:', videoSrc, e)
            setIsLoaded(false)
          }}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.5s ease' }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/65 to-black/75"></div>
    </div>
  )
}

