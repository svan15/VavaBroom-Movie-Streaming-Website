import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { searchMovies } from '../utils/api'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const loadSearchResults = async () => {
      if (!query) return
      
      try {
        setLoading(true)
        const data = await searchMovies(query, 1)
        setMovies(data.results)
        setTotalResults(data.total_results)
        setPage(1)
      } catch (error) {
        console.error('Error searching movies:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSearchResults()
  }, [query])

  const loadMore = async () => {
    if (loading) return
    
    try {
      setLoading(true)
      const nextPage = page + 1
      const moreMovies = await searchMovies(query, nextPage)
      setMovies(prev => [...prev, ...moreMovies.results])
      setPage(nextPage)
    } catch (error) {
      console.error('Error loading more results:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-20">
      <h1 className="mb-8 text-3xl font-bold text-white">
        Search Results for "{query}"
        <span className="ml-2 text-lg font-normal text-gray-400">
          ({totalResults} results)
        </span>
      </h1>

      {movies.length === 0 ? (
        <p className="text-center text-gray-400">
          No movies found matching your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {movies.length < totalResults && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-400"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}