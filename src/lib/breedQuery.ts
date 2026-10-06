import type { BreedSortField, CatBreed, SortDirection } from '../types/cat'

const nameCollator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })

export interface BreedAttributeFilters {
  origin?: string
  temperaments?: readonly string[]
}

export interface CollectionFilters {
  query: string
  sortField: BreedSortField
  direction: SortDirection
  origin: string
  temperaments: string[]
}

function normalizedText(value: string): string {
  return value.trim().toLocaleLowerCase('en')
}

/** Read shared list controls and gallery-only attributes without changing the URL. */
export function readCollectionFilters(params: URLSearchParams, view: 'list' | 'gallery'): CollectionFilters {
  const traitsByName = new Map<string, string>()
  if (view === 'gallery') {
    for (const value of params.getAll('trait')) {
      const trimmed = value.trim()
      const normalized = normalizedText(trimmed)
      if (normalized && !traitsByName.has(normalized)) traitsByName.set(normalized, trimmed)
    }
  }

  return {
    // Preserve spaces while typing; the matching function trims the completed query.
    query: params.get('q') ?? '',
    sortField: params.get('sort') === 'lifeSpan' ? 'lifeSpan' : 'name',
    direction: params.get('order') === 'desc' ? 'desc' : 'asc',
    origin: view === 'gallery' ? (params.get('origin') ?? '').trim() : '',
    temperaments: [...traitsByName.values()],
  }
}

function compareNames(left: CatBreed, right: CatBreed): number {
  return nameCollator.compare(left.name, right.name)
    || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
}

function lowerLifeSpan(value: string | null): number | null {
  if (!value) return null
  const match = value.match(/^\s*(\d+(?:\.\d+)?)\s*(?:[-–—]\s*(\d+(?:\.\d+)?))?\s*(?:years?)?\s*$/i)
  if (!match) return null
  const lower = Number(match[1])
  const upper = match[2] === undefined ? lower : Number(match[2])
  return Number.isFinite(lower) && Number.isFinite(upper) && lower <= upper ? lower : null
}

/** Match attributes and names before sorting a new array; missing life spans stay last. */
export function filterAndSortBreeds(
  breeds: readonly CatBreed[],
  query: string,
  sortField: BreedSortField,
  direction: SortDirection,
  attributes: BreedAttributeFilters = {},
): CatBreed[] {
  const normalizedQuery = normalizedText(query)
  const origin = normalizedText(attributes.origin ?? '')
  const temperaments = new Set((attributes.temperaments ?? []).map(normalizedText).filter(Boolean))
  const result = breeds.filter((breed) => (
    normalizedText(breed.name).includes(normalizedQuery)
    && (!origin || normalizedText(breed.origin ?? '') === origin)
    && (temperaments.size === 0 || breed.temperament.some((trait) => temperaments.has(normalizedText(trait))))
  ))
  const order = direction === 'asc' ? 1 : -1

  return result.sort((left, right) => {
    if (sortField === 'name') {
      return nameCollator.compare(left.name, right.name) * order
        || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)
    }

    const leftLifeSpan = lowerLifeSpan(left.lifeSpan)
    const rightLifeSpan = lowerLifeSpan(right.lifeSpan)
    if (leftLifeSpan === null && rightLifeSpan === null) return compareNames(left, right)
    if (leftLifeSpan === null) return 1
    if (rightLifeSpan === null) return -1
    return (leftLifeSpan - rightLifeSpan) * order || compareNames(left, right)
  })
}
