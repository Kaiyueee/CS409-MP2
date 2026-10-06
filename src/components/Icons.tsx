// SVG artwork is downloaded from Lucide, not generated in this project.
// Exact source URLs and revision: docs/icon-sources.json.
// License (including Feather-derived icons): public/icons/lucide/LICENSE.
type IconName = 'cat' | 'list' | 'layout-grid' | 'arrow-right' | 'search'

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <use href={`${import.meta.env.BASE_URL}icons/lucide/${name}.svg#icon`} />
    </svg>
  )
}

export function CatIcon() {
  return <Icon name="cat" />
}

export function ListIcon() {
  return <Icon name="list" />
}

export function GridIcon() {
  return <Icon name="layout-grid" />
}

export function ArrowIcon({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  return <Icon name="arrow-right" className={direction === 'left' ? 'arrow-left' : undefined} />
}

export function SearchIcon() {
  return <Icon name="search" />
}
