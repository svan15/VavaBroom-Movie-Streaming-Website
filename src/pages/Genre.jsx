import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import MovieCard from '../components/MovieCard'
import { fetchMoviesByGenre, fetchGenreDetails } from '../utils/api'

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Most Popular' },
  { id: 'vote_average.desc', label: 'Top Rated' },
  { id: 'release_date.desc', label: 'Latest' },
  { id: 'revenue.desc', label: 'Highest Grossing' }
]

export default function Genre() {
  const { id } = useParams()
  const [movies, setMovies] = useState([])
  const [genre, setGenre] = useState(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [totalPages, setTotalPages] = useState(1)
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    const loadGenreData = async () => {
      try {
        setLoading(true)
        const [moviesData, genreData] = await Promise.all([
          fetchMoviesByGenre(id, 1, sortBy),
          fetchGenreDetails(id)
        ])
        setMovies(moviesData.results)
        setTotalPages(moviesData.total_pages)
        setGenre(genreData)
        setPage(1)
      } catch (error) {
        console.error('Error loading genre data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGenreData()
  }, [id, sortBy])

  const loadMore = async () => {
    if (loading) return
    
    try {
      setLoading(true)
      const nextPage = page + 1
      const moreMovies = await fetchMoviesByGenre(id, nextPage)
      setMovies(prev => [...prev, ...moreMovies.results])
      setPage(nextPage)
    } catch (error) {
      console.error('Error loading more movies:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !movies.length) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-gray-800" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse rounded-lg bg-gray-800" />
          ))}
        </div>
      </div>
    )
  }

  if (!genre) return null

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white">{genre.name}</h1>
        
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
          >
            <span>Sort by: {SORT_OPTIONS.find(opt => opt.id === sortBy)?.label}</span>
            <ChevronDownIcon className="h-5 w-5" />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-gray-800 py-2 shadow-xl">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id)
                    setShowSortMenu(false)
                  }}
                  className={`w-full px-4 py-2 text-left transition-colors hover:bg-gray-700 ${sortBy === option.id ? 'text-red-500' : 'text-white'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {page < totalPages && (
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