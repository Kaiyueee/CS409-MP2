import { Link } from 'react-router-dom'
import type { CatBreed } from '../types/cat'
import { CatImage } from './CatImage'
import { ArrowIcon } from './Icons'

export function BreedCard({ breed, view, index, collectionSearch = '' }: { breed: CatBreed; view: 'list' | 'gallery'; index: number; collectionSearch?: string }) {
  const detailParams = new URLSearchParams(collectionSearch)
  detailParams.set('from', view)
  return (
    <li>
      <Link className={`breed-card ${view === 'list' ? 'breed-row' : 'breed-tile'}`} to={`/breeds/${breed.id}?${detailParams.toString()}`}>
        <div className="breed-photo"><CatImage breed={breed} /><span className="photo-index">{String(index + 1).padStart(2, '0')}</span></div>
        <div className="breed-copy">
          <div className="breed-title-line"><h3>{breed.name}</h3><span className="card-arrow"><ArrowIcon /></span></div>
          <p className="breed-origin">{breed.origin || 'Origin unknown'}</p>
          <div className="traits">{breed.temperament.slice(0, 2).map((trait) => <span key={trait}>{trait}</span>)}</div>
        </div>
        <div className="breed-lifespan"><span>Life span</span><strong>{breed.lifeSpan ? `${breed.lifeSpan} years` : 'Unknown'}</strong></div>
        <span className="row-arrow"><ArrowIcon /></span>
      </Link>
    </li>
  )
}
