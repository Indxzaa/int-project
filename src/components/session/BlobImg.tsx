'use client'

import { useState, useEffect } from 'react'

interface BlobImgProps {
  blob: Blob
  filename: string
  className?: string
}

export function BlobImg({ blob, filename, className = '' }: BlobImgProps) {
  const [src, setSrc] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(blob)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return src
    ? <img src={src} alt={filename} className={className} />
    : null
}
