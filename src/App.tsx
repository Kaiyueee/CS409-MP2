import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { CatIcon, GridIcon, ListIcon } from './components/Icons'
import { CollectionPage } from './pages/CollectionPage'
import { DetailPage } from './pages/DetailPage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Little Paws home"><span className="brand-mark"><CatIcon /></span><span>little paws<span className="brand-dot">.</span></span></Link>
        <nav className="main-nav" aria-label="Main navigation"><NavLink to="/" end><ListIcon /> Breed guide</NavLink><NavLink to="/gallery"><GridIcon /> Gallery</NavLink></nav>
        <span className="header-note">A little space for cat people.</span>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<CollectionPage view="list" />} />
          <Route path="/gallery" element={<CollectionPage view="gallery" />} />
          <Route path="/breeds/:breedId" element={<DetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer"><Link className="footer-brand" to="/"><CatIcon /> little paws.</Link><p>A little curiosity. A lot of whiskers.</p><a href="https://thecatapi.com/" target="_blank" rel="noreferrer">Cat data &amp; photos: The Cat API ↗</a></footer>
    </div>
  )
}
export default App
