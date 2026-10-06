import axios from 'axios'
import { normalizeBreed } from '../types/cat'
import type { CatApiBreed, CatBreed, CatImageData } from '../types/cat'

const PAGE_SIZE = 100
const MAX_PAGES = 20

const catApi = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
  timeout: 15_000,
})

let cachedBreeds: CatBreed[] | null = null
let pendingRequest: Promise<CatBreed[]> | null = null

class BreedRequestError extends Error {}

function nullableText(value: unknown): string | null {
  return typeof value === 'string' ? value.trim() || null : null
}

function parseBreed(value: unknown): CatApiBreed {
  if (!value || typeof value !== 'object') {
    throw new BreedRequestError('The cat service returned an unexpected response. Please try again.')
  }

  const breed = value as Record<string, unknown>
  const id = nullableText(breed.id)
  const name = nullableText(breed.name)

  if (!id || !name) {
    throw new BreedRequestError('The cat service returned incomplete breed information. Please try again.')
  }

  let image: CatImageData | null = null
  if (breed.image && typeof breed.image === 'object') {
    const source = breed.image as Record<string, unknown>
    const url = nullableText(source.url)
    if (url && /^https?:\/\//i.test(url)) {
      image = {
        id: nullableText(source.id) ?? nullableText(breed.reference_image_id) ?? id,
        url,
        ...(typeof source.width === 'number' && source.width > 0 ? { width: source.width } : {}),
        ...(typeof source.height === 'number' && source.height > 0 ? { height: source.height } : {}),
      }
    }
  }

  return {
    id,
    name,
    origin: nullableText(breed.origin),
    life_span: nullableText(breed.life_span),
    temperament: nullableText(breed.temperament),
    description: nullableText(breed.description),
    reference_image_id: nullableText(breed.reference_image_id),
    image,
  }
}

async function fetchAllBreeds(): Promise<CatBreed[]> {
  const configuredKey: unknown = import.meta.env.VITE_CAT_API_KEY
  const apiKey = nullableText(configuredKey)

  if (!apiKey) {
    throw new BreedRequestError('The cat service is not configured yet. Add its API key and restart the app.')
  }

  const breedsById = new Map<string, CatBreed>()

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await catApi.get<unknown>('/breeds', {
      headers: { 'x-api-key': apiKey },
      params: { limit: PAGE_SIZE, page },
    })

    if (!Array.isArray(response.data)) {
      throw new BreedRequestError('The cat service returned an unexpected response. Please try again.')
    }

    const sizeBeforePage = breedsById.size
    for (const item of response.data) {
      const breed = normalizeBreed(parseBreed(item))
      breedsById.set(breed.id, breed)
    }

    // Do not present a partial collection as complete if pagination is ignored.
    if (response.data.length > 0 && breedsById.size === sizeBeforePage) {
      throw new BreedRequestError('The full breed list could not be loaded. Please try again in a moment.')
    }

    if (response.data.length < PAGE_SIZE) {
      return [...breedsById.values()]
    }
  }

  throw new BreedRequestError('The full breed list could not be loaded. Please try again in a moment.')
}

export function getCachedBreeds(): CatBreed[] | null {
  return cachedBreeds
}

export function getBreeds(options: { force?: boolean } = {}): Promise<CatBreed[]> {
  // Share one request across components, remounts, and React StrictMode effects.
  if (pendingRequest) return pendingRequest
  if (cachedBreeds !== null && !options.force) return Promise.resolve(cachedBreeds)

  pendingRequest = fetchAllBreeds()
    .then((breeds) => {
      cachedBreeds = breeds
      return breeds
    })
    .finally(() => {
      pendingRequest = null
    })

  return pendingRequest
}

export function getBreedErrorMessage(error: unknown): string {
  if (error instanceof BreedRequestError) return error.message

  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'The cat service could not authorize this request. Please check the API key.'
    }
    if (error.response?.status === 429) {
      return 'The cat service has received too many requests. Please wait a little and try again.'
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return 'The cat service took too long to respond. Please try again.'
    }
    if (!error.response) {
      return 'The cat service could not be reached. Check your connection and try again.'
    }
  }

  return 'We could not load the cats right now. Please try again.'
}
