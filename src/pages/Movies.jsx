import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import CategoryTabs from '../components/CategoryTabs'
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies } from '../utils/api'

const TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
  { id: 'top_rated', label: 'Top Rated' }
]

export default function Movies() {
  const [activeTab, setActiveTab] = useState('popular')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadMovies(1, true)
  }, [activeTab])

  const loadMovies = async (pageNum, reset = false) => {
    if (loading && !reset) return

    try {
      setLoading(true)
      let data

      switch (activeTab) {
        case 'popular':
          data = await fetchPopularMovies(pageNum)
          break
        case 'trending':
          data = await fetchTrendingMovies('week')
          break
        case 'top_rated':
          data = await fetchTopRatedMovies(pageNum)
          break
        default:
          return
      }

      setMovies(prev => reset ? data.results : [...prev, ...data.results])
      setHasMore(data.page < data.total_pages)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadMovies(page + 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Movies</h1>
        
        <CategoryTabs
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
        />

        <div className="grid animate-pulse gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="aspect-[2/3] rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Movies</h1>
      
      <CategoryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg bg-red-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-400"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}