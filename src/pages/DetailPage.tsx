import { Link, useParams, useSearchParams } from 'react-router-dom'
import { BreedDataState } from '../components/BreedDataState'
import { CatImage } from '../components/CatImage'
import { ArrowIcon } from '../components/Icons'
import { useBreeds } from '../hooks/useBreeds'
import { filterAndSortBreeds, readCollectionFilters } from '../lib/breedQuery'
import { NotFoundPage } from './NotFoundPage'

export function DetailPage() {
  const { breedId } = useParams()
  const [searchParams] = useSearchParams()
  const { breeds, loading, error, reload } = useBreeds()
  const from = searchParams.get('from') === 'gallery' ? 'gallery' : 'list'
  const collectionParams = new URLSearchParams(searchParams)
  collectionParams.delete('from')
  const collectionSearch = collectionParams.toString()
  const backUrl = `${from === 'gallery' ? '/gallery' : '/'}${collectionSearch ? `?${collectionSearch}` : ''}`
  const detailSearch = searchParams.toString()
  const returnLink = (
    <Link className="back-link" to={backUrl}>
      <ArrowIcon direction="left" /> Back to {from === 'gallery' ? 'gallery' : 'breed guide'}
    </Link>
  )

  if (loading || error) {
    return (
      <section className="detail-page" aria-label="Breed details">
        <div className="detail-topline">{returnLink}</div>
        <BreedDataState loading={loading} error={error} onRetry={reload} />
      </section>
    )
  }
  const breed = breeds.find((item) => item.id === breedId)
  if (!breed) {
    return (
      <div className="detail-page">
        <div className="detail-topline">{returnLink}</div>
        <NotFoundPage isBreed />
      </div>
    )
  }

  const filters = readCollectionFilters(searchParams, from)
  const results = filterAndSortBreeds(
    breeds,
    filters.query,
    filters.sortField,
    filters.direction,
    { origin: filters.origin, temperaments: filters.temperaments },
  )
  // A manually edited detail URL may point outside the saved search results.
  const inSelection = results.some((item) => item.id === breed.id)
  const sequence = inSelection ? results : [breed]
  const index = sequence.findIndex((item) => item.id === breed.id)
  const previous = sequence[(index - 1 + sequence.length) % sequence.length]
  const next = sequence[(index + 1) % sequence.length]

  function detailUrl(id: string): string {
    return `/breeds/${encodeURIComponent(id)}${detailSearch ? `?${detailSearch}` : ''}`
  }

  return (
    <section className="detail-page" aria-labelledby="breed-heading">
      <div className="detail-topline">{returnLink}<span>THE BREED NOTEBOOK · {String(index + 1).padStart(2, '0')}</span></div>
      <div className="detail-layout">
        <div className="detail-photo-wrap"><div className="detail-photo"><CatImage breed={breed} eager /></div><p className="photo-credit">A closer look at the {breed.name}. <span>{breed.image ? 'Photo via The Cat API' : 'No photo supplied for this breed'}</span></p></div>
        <div className="detail-copy">
          <p className="eyebrow">SMALL PAWS. A WHOLE PERSONALITY.</p>
          <h1 id="breed-heading">{breed.name}<span>.</span></h1>
          <div className="traits detail-traits">{breed.temperament.slice(0, 3).map((trait) => <span key={trait}>{trait}</span>)}</div>
          <p className="detail-description">{breed.description}</p>
          <dl className="breed-facts"><div><dt>Origin</dt><dd>{breed.origin || 'Not recorded'}</dd></div><div><dt>Life span</dt><dd>{breed.lifeSpan ? `${breed.lifeSpan} years` : 'Not recorded'}</dd></div></dl>
          <div className="personality-section"><h2>A personality of their own</h2><div className="personality-tags">{breed.temperament.length ? breed.temperament.map((trait) => <span key={trait}>{trait}</span>) : <span>Not recorded</span>}</div><p>Breed traits offer a little introduction. Every cat is an individual.</p></div>
        </div>
      </div>
      {sequence.length > 1 ? (
        <nav className="breed-pagination" aria-label="Browse breeds in this selection">
          <Link to={detailUrl(previous.id)} aria-label={`Previous breed: ${previous.name}`}>
            <ArrowIcon direction="left" />
            <span><small>PREVIOUS BREED</small><strong>{previous.name}</strong></span>
          </Link>
          <span className="page-position" aria-label={`Breed ${index + 1} of ${sequence.length}`}>
            {index + 1} <span>/ {sequence.length}</span>
          </span>
          <Link className="next-breed" to={detailUrl(next.id)} aria-label={`Next breed: ${next.name}`}>
            <span><small>NEXT BREED</small><strong>{next.name}</strong></span>
            <ArrowIcon />
          </Link>
        </nav>
      ) : (
        <p className="detail-description" role="status">
          {inSelection
            ? 'Only breed in this selection.'
            : 'This breed is outside your current selection. Return to the collection to browse the matching cats.'}
        </p>
      )}
    </section>
  )
}
