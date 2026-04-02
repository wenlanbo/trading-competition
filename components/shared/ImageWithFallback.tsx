'use client'

import Image from 'next/image'
import type { ImgHTMLAttributes } from 'react'
import { useEffect, useState } from 'react'

interface ImageWithFallbackProps {
  src: string | undefined
  fallbackSrc?: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  quality?: number
  className?: string
}

export const ImageWithFallback = ({
  src,
  fallbackSrc = '/placeholder-image.webp',
  alt,
  width,
  height,
  priority = false,
  fill = false,
  quality = 75,
  className,
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc)

  useEffect(() => {
    setImgSrc(src || fallbackSrc)
  }, [src, fallbackSrc])

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc)
    }
  }

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        onError={handleError}
        quality={quality}
        className={className}
      />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 100}
      height={height || 100}
      priority={priority}
      onError={handleError}
      quality={quality}
      className={className}
    />
  )
}
