import { useLayoutEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BreedCard } from '../components/BreedCard'
import { BreedDataState } from '../components/BreedDataState'
import { CollectionHero } from '../components/CollectionHero'
import { GridIcon, ListIcon, SearchIcon } from '../components/Icons'
import { useBreeds } from '../hooks/useBreeds'
import { filterAndSortBreeds, readCollectionFilters } from '../lib/breedQuery'

const popularTraits = ['Affectionate', 'Playful', 'Gentle', 'Curious', 'Intelligent', 'Social']
const sameText = (left: string, right: string) => left.toLocaleLowerCase('en') === right.toLocaleLowerCase('en')

export function CollectionPage({ view }: { view: 'list' | 'gallery' }) {
  const isGallery = view === 'gallery'
  const [searchParams, setSearchParams] = useSearchParams()
  const latestParams = useRef(searchParams)
  useLayoutEffect(() => {
    latestParams.current = searchParams
  }, [searchParams])
  const { breeds, loading, error, reload } = useBreeds()
  const { query, sortField, direction, origin, temperaments } = readCollectionFilters(searchParams, view)
  const displayedBreeds = filterAndSortBreeds(breeds, query, sortField, direction, { origin, temperaments })
  const collectionSearch = searchParams.toString()
  const viewSuffix = collectionSearch ? `?${collectionSearch}` : ''
  const controlsDisabled = loading || !!error
  const hasFilters = !!query.trim() || !!origin || temperaments.length > 0
  const availableOrigins = [...new Set(breeds.flatMap((breed) => breed.origin ? [breed.origin] : []))]
    .sort((left, right) => left.localeCompare(right, 'en'))
  const knownOrigin = availableOrigins.find((item) => sameText(item, origin))
  const traitOptions = [...popularTraits, ...temperaments.filter((trait) => !popularTraits.some((item) => sameText(item, trait)))]

  function updateParams(change: (params: URLSearchParams) => void) {
    // Merge rapid control changes before the router finishes its next render.
    const updated = new URLSearchParams(latestParams.current)
    change(updated)
    latestParams.current = updated
    setSearchParams(updated, { replace: true })
  }

  function updateQuery(key: string, value: string) {
    updateParams((params) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
  }

  function toggleTrait(trait: string) {
    updateParams((params) => {
      const selected = readCollectionFilters(params, 'gallery').temperaments
      const next = selected.some((item) => sameText(item, trait))
        ? selected.filter((item) => !sameText(item, trait))
        : [...selected, trait]
      params.delete('trait')
      next.forEach((item) => params.append('trait', item))
    })
  }

  function clearFilters() {
    updateParams((params) => {
      params.delete('q')
      if (isGallery) {
        params.delete('origin')
        params.delete('trait')
      }
    })
  }

  return (
    <>
      <CollectionHero breeds={breeds} view={view} />
      <section id="collection" className="collection-section" aria-labelledby="collection-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CAT BREED COLLECTION</p>
            <h2 id="collection-heading">{isGallery ? 'Every cat, a little work of art.' : 'Find your kind of curious.'}</h2>
          </div>
          <div className="view-switch" aria-label="Collection view">
            <Link to={`/${viewSuffix}`} aria-current={!isGallery ? 'page' : undefined}><ListIcon /> List</Link>
            <Link to={`/gallery${viewSuffix}`} aria-current={isGallery ? 'page' : undefined}><GridIcon /> Gallery</Link>
          </div>
        </div>
        <div className="collection-tools">
          <label className="search-field">
            <SearchIcon /><span className="sr-only">Search cat breeds</span>
            <input disabled={controlsDisabled} type="search" placeholder="Search for a breed…" value={query} onChange={(event) => updateQuery('q', event.target.value)} />
          </label>
          <label className="sort-field">
            <span>Sort by</span>
            <select disabled={controlsDisabled} value={sortField} onChange={(event) => updateQuery('sort', event.target.value)} aria-label="Sort breeds">
              <option value="name">Breed name</option><option value="lifeSpan">Life span (minimum)</option>
            </select>
          </label>
          <button className="order-button" type="button" disabled={controlsDisabled} aria-label={`Sort ${direction === 'asc' ? 'descending' : 'ascending'}`} onClick={() => updateParams((params) => params.set('order', params.get('order') === 'desc' ? 'asc' : 'desc'))}>
            {direction === 'asc' ? 'Ascending' : 'Descending'} <span aria-hidden="true">{direction === 'asc' ? '↑' : '↓'}</span>
          </button>
        </div>
        {isGallery && (
          <fieldset className="gallery-filters" disabled={controlsDisabled}>
            <legend>Find a personality you love</legend>
            <div className="filter-topline">
              <p id="personality-help">Choose any personalities. Cats matching at least one will appear.</p>
              <label className="origin-field">Origin
                <select value={knownOrigin ?? origin} onChange={(event) => updateQuery('origin', event.target.value)}>
                  <option value="">All origins</option>
                  {origin && !knownOrigin && <option value={origin}>{origin}</option>}
                  {availableOrigins.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
            </div>
            <div className="personality-filters" role="group" aria-label="Personality filters" aria-describedby="personality-help">
              <button type="button" aria-pressed={temperaments.length === 0} onClick={() => updateParams((params) => params.delete('trait'))}>All personalities</button>
              {traitOptions.map((trait) => <button type="button" key={trait} aria-pressed={temperaments.some((item) => sameText(item, trait))} onClick={() => toggleTrait(trait)}>{trait}</button>)}
            </div>
            {hasFilters && <button className="clear-filters" type="button" onClick={clearFilters}>Clear search &amp; filters <span aria-hidden="true">×</span></button>}
          </fieldset>
        )}
        <div className="collection-meta">
          <p role="status" aria-live="polite">
            {loading ? 'Gathering the breed collection…' : error ? 'The collection is unavailable' : <><strong>{displayedBreeds.length}</strong>{hasFilters ? ` of ${breeds.length} breeds match your ${isGallery ? 'selection' : 'search'}` : ' breeds to get to know'}</>}
          </p>
          <p>{sortField === 'lifeSpan' ? 'Sorted by the lower end of each life span range' : `A world of whiskers, from ${direction === 'asc' ? 'A to Z' : 'Z to A'}`}</p>
        </div>
        {loading || error ? <BreedDataState loading={loading} error={error} onRetry={reload} /> : displayedBreeds.length === 0 ? (
          <div className="empty-results">
            <SearchIcon /><h3>No little paws found.</h3>
            {hasFilters ? <>
              <p>{isGallery ? 'No breeds match this combination. Try another name, origin or personality.' : `No breeds match “${query.trim()}”. Try a different breed name.`}</p>
              <button type="button" className="primary-link" onClick={clearFilters}>{isGallery ? 'Reset search & filters' : 'Clear search'}</button>
            </> : <>
              <p>The cat service returned an empty collection. Please try again.</p>
              <button type="button" className="primary-link" onClick={reload}>Try again</button>
            </>}
          </div>
        ) : <ul className={isGallery ? 'breed-grid' : 'breed-list'}>{displayedBreeds.map((breed, index) => <BreedCard key={breed.id} breed={breed} index={index} view={view} collectionSearch={collectionSearch} />)}</ul>}
        <div className="collection-end"><span aria-hidden="true">✳</span><p>Every breed has a story. Every cat has a personality.</p></div>
      </section>
    </>
  )
}
