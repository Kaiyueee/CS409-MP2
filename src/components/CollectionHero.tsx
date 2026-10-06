import { Link } from 'react-router-dom'
import type { CatBreed } from '../types/cat'
import { previewBreeds } from '../data/previewBreeds'
import { CatImage } from './CatImage'
import { ArrowIcon } from './Icons'
import './CollectionHero.css'

const coverBreeds = ['ragd', 'abys', 'bsho']

export function CollectionHero({ breeds, view }: { breeds: CatBreed[]; view: 'list' | 'gallery' }) {
  const isGallery = view === 'gallery'
  const portraits = coverBreeds.flatMap((id) => {
    const breed = breeds.find((item) => item.id === id) ?? previewBreeds.find((item) => item.id === id)
    return breed ? [breed] : []
  })

  return (
    <section className={`collection-hero ${isGallery ? 'collection-hero-gallery' : ''}`} aria-labelledby="hero-heading">
      <div className="cover-copy">
        <p className="eyebrow">THE LITTLE PAWS FIELD GUIDE <span aria-hidden="true">✳</span></p>
        <h1 id="hero-heading">A little curious.<br />A lot of <em>cat.</em></h1>
        <p className="cover-description">From gentle lap cats to curious little explorers. Find a face, discover a personality, and get to know your kind of cat.</p>
        <div className="cover-actions">
          <a className="primary-link" href="#collection">{isGallery ? 'Browse the portraits' : 'Meet the cats'} <ArrowIcon /></a>
          {!isGallery && <Link className="cover-gallery-link" to="/gallery">Explore gallery <span aria-hidden="true">↗</span></Link>}
        </div>
        <p className="cover-note"><span aria-hidden="true">♡</span> {breeds.length ? `${breeds.length} breeds. A thousand little reasons to fall in love.` : 'A little field guide for a lifelong love of cats.'}</p>
      </div>
      <div className="cover-portraits" aria-label="Meet three of the cats">
        {portraits.map((breed, index) => (
          <Link className={`cover-portrait cover-portrait-${index + 1}`} key={breed.id} to={`/breeds/${breed.id}?from=${view}`} aria-label={`Meet the ${breed.name}`}>
            <div className="cover-photo"><CatImage breed={breed} eager /></div>
            <div className="cover-caption"><span>{breed.name}</span><ArrowIcon /></div>
          </Link>
        ))}
        <span className="cover-stamp" aria-hidden="true">a few faces<br /><em>to fall for.</em></span>
      </div>
      {!isGallery && <div className="cover-discovery">
        <span className="discovery-label">A personality for every cat person</span>
        <div className="discovery-links">
          <Link to="/gallery?trait=Gentle">Gentle souls <ArrowIcon /></Link>
          <Link to="/gallery?trait=Playful">Playful pals <ArrowIcon /></Link>
          <Link to="/gallery?trait=Curious">Curious minds <ArrowIcon /></Link>
        </div>
      </div>}
    </section>
  )
}
