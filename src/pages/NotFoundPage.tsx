import { Link } from 'react-router-dom'
import { CatIcon } from '../components/Icons'

export function NotFoundPage({ isBreed = false }: { isBreed?: boolean }) {
  return <section className="not-found"><CatIcon /><p className="eyebrow">A LITTLE OFF THE BEATEN PAWTH</p><h1>{isBreed ? 'This cat is out exploring.' : 'This page wandered off.'}</h1><p>{isBreed ? 'We could not find that breed in the collection.' : 'Let’s get you back to a familiar place.'}</p><Link className="primary-link" to="/">Back to the breed guide</Link></section>
}
