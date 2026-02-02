"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageCarouselProps {
  images: string[]
  alt: string
  initialIndex?: number
  onIndexChange?: (index: number) => void
}

/**
 * Optimized image carousel with preloading for instant navigation.
 * - Preloads adjacent images (prev/next) in background
 * - Uses CSS transitions for smooth visual feedback
 * - Memoized to prevent unnecessary re-renders
 */
export const ImageCarousel = memo(function ImageCarousel({
  images,
  alt,
  initialIndex = 0,
  onIndexChange,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([initialIndex]))

  // Preload an image and track when it's loaded
  const preloadImage = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return
    if (loadedImages.has(index)) return

    const img = new Image()
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(index))
    }
    img.src = images[index]
  }, [images, loadedImages])

  // Preload adjacent images when current index changes
  useEffect(() => {
    // Preload next image
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    preloadImage(nextIndex)

    // Preload previous image
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    preloadImage(prevIndex)

    // Also preload the one after next for smoother rapid clicking
    const nextNextIndex = nextIndex === images.length - 1 ? 0 : nextIndex + 1
    preloadImage(nextNextIndex)
  }, [currentIndex, images.length, preloadImage])

  // Preload first few images on mount
  useEffect(() => {
    // Preload first 3 images immediately
    for (let i = 0; i < Math.min(3, images.length); i++) {
      preloadImage(i)
    }
  }, [images.length, preloadImage])

  const goToIndex = useCallback((index: number) => {
    if (index === currentIndex) return

    setIsTransitioning(true)

    // Quick transition for visual feedback
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
      onIndexChange?.(index)
    }, 50)
  }, [currentIndex, onIndexChange])

  const nextImage = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    goToIndex(newIndex)
  }, [currentIndex, images.length, goToIndex])

  const prevImage = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    goToIndex(newIndex)
  }, [currentIndex, images.length, goToIndex])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevImage()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextImage, prevImage])

  if (images.length === 0) return null

  return (
    <div className="relative">
      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
        {/* Current image with fade transition */}
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-contain transition-opacity duration-150 ${
            isTransitioning ? "opacity-70" : "opacity-100"
          }`}
          loading="eager"
          decoding="async"
          style={{
            willChange: "opacity",
            contain: "layout style paint"
          }}
        />

        {/* Hidden preload images - browser caches these */}
        <div className="hidden" aria-hidden="true">
          {images.map((src, index) => (
            index !== currentIndex && loadedImages.has(index) ? null : (
              <link key={src} rel="preload" as="image" href={src} />
            )
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  goToIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-colors focus:outline-none ${
                  index === currentIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>

          {/* Image counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  )
})
