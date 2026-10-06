import { CatIcon } from './Icons'

export function BreedDataState({ loading, error, onRetry }: { loading: boolean; error: string | null; onRetry: () => void }) {
  return <div className="data-state" role={loading ? 'status' : 'alert'}><CatIcon /><h2>{loading ? 'Getting the cats together…' : 'The cats are taking a little break.'}</h2><p>{loading ? 'Their portraits and personalities are on the way.' : error}</p>{!loading && <button type="button" className="primary-link" onClick={onRetry}>Try again</button>}</div>
}
