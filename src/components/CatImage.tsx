import { useState } from 'react'
import type { CatBreed } from '../types/cat'
import { CatIcon } from './Icons'

export function CatImage({ breed, eager = false }: { breed: CatBreed; eager?: boolean }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const url = breed.image?.url
  if (!url || failedUrl === url) {
    const message = url ? 'Photo could not load' : 'Photo not provided'
    return <div className="image-placeholder" role="img" aria-label={`${message} for ${breed.name}`}><CatIcon /><span>{message}</span></div>
  }
  return <img src={url} alt={`${breed.name} cat`} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedUrl(url)} />
}
