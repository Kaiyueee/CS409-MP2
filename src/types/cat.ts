export interface CatImageData {
  id: string
  url: string
  width?: number
  height?: number
}

// Fields received from The Cat API can be absent or null.
export interface CatApiBreed {
  id: string
  name: string
  origin?: string | null
  life_span?: string | null
  temperament?: string | null
  description?: string | null
  reference_image_id?: string | null
  image?: CatImageData | null
}

// Components use this consistent shape rather than raw API responses.
export interface CatBreed {
  id: string
  name: string
  origin: string | null
  lifeSpan: string | null
  temperament: string[]
  description: string
  image: CatImageData | null
}

export type BreedSortField = 'name' | 'lifeSpan'
export type SortDirection = 'asc' | 'desc'

export interface BreedFilters {
  query: string
  origin: string | null
  temperament: string | null
  sortField: BreedSortField
  sortDirection: SortDirection
}

export function normalizeBreed(breed: CatApiBreed): CatBreed {
  return {
    id: breed.id,
    name: breed.name,
    origin: breed.origin?.trim() || null,
    lifeSpan: breed.life_span?.trim() || null,
    temperament: [...new Set((breed.temperament ?? '').split(',').map((trait) => trait.trim()).filter(Boolean))],
    description: breed.description?.trim() || 'There is no description for this breed yet.',
    image: breed.image?.url ? breed.image : null,
  }
}
