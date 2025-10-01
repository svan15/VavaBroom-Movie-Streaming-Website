import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import CategoryTabs from '../components/CategoryTabs'

const TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
  { id: 'top_rated', label: 'Top Rated' }
]

import { fetchPopularSeries, fetchTopRatedSeries, fetchTrendingSeries } from '../utils/api'

async function fetchSeries(type, page = 1) {
  switch (type) {
    case 'popular':
      return fetchPopularSeries(page)
    case 'trending':
      return fetchTrendingSeries('week')
    case 'top_rated':
      return fetchTopRatedSeries(page)
    default:
      throw new Error('Invalid series type')
  }
}

export default function Series() {
  const [activeTab, setActiveTab] = useState('popular')
  const [series, setSeries] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    loadSeries(1, true)
  }, [activeTab])

  const loadSeries = async (pageNum, reset = false) => {
    if (loading && !reset) return

    try {
      setLoading(true)
      const data = await fetchSeries(activeTab, pageNum)

      setSeries(prev => reset ? data.results : [...prev, ...data.results])
      setHasMore(data.page < data.total_pages)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading series:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadSeries(page + 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">TV Series</h1>
        
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
      <h1 className="mb-8 text-4xl font-bold text-white">TV Series</h1>
      
      <CategoryTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {series.map((show) => (
          <MovieCard 
            key={show.id} 
            movie={{
              id: show.id,
              title: show.name,
              poster_path: show.poster_path,
              vote_average: show.vote_average,
              release_date: show.first_air_date
            }} 
          />
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