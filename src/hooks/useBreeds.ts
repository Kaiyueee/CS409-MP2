import { useCallback, useEffect, useState } from 'react'
import { getBreedErrorMessage, getBreeds, getCachedBreeds } from '../services/catApi'
import type { CatBreed } from '../types/cat'

interface BreedsState {
  breeds: CatBreed[]
  loading: boolean
  error: string | null
}

export function useBreeds(): BreedsState & { reload: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState<BreedsState>(() => {
    const cached = getCachedBreeds()
    return { breeds: cached ?? [], loading: cached === null, error: null }
  })

  useEffect(() => {
    let active = true

    getBreeds({ force: attempt > 0 }).then(
      (breeds) => {
        if (active) setState({ breeds, loading: false, error: null })
      },
      (error: unknown) => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: getBreedErrorMessage(error),
          }))
        }
      },
    )

    // The shared request may finish after this view is no longer mounted.
    return () => { active = false }
  }, [attempt])

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: null }))
    setAttempt((current) => current + 1)
  }, [])

  return { ...state, reload }
}
