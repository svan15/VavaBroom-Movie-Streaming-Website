import { useState, useEffect } from 'react'
import HeroBanner from '../components/HeroBanner'
import MovieCarousel from '../components/MovieCarousel'
import GenrePill from '../components/GenrePill'
import MovieCard from '../components/MovieCard'
import { fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchGenres } from '../utils/api'

export default function Home() {
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([])
  const [featuredMovie, setFeaturedMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [popular, topRated, trending] = await Promise.all([
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchTrendingMovies('week')
        ])

        setPopularMovies(popular.results)
        setTopRatedMovies(topRated.results.slice(0, 10)) // Only take top 10
        setTrendingMovies(trending.results)
        setFeaturedMovie(trending.results[0])
      } catch (error) {
        console.error('Error loading home page data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen animate-pulse">
        <div className="h-[85vh] w-full bg-gray-800" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-24 rounded-full bg-gray-800" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-12">
              <div className="h-8 w-48 mb-6 bg-gray-800 rounded" />
              <div className="flex gap-4 overflow-hidden">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex-none w-48 h-72 bg-gray-800 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroBanner movie={featuredMovie} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Top 10 Movies Section */}
          <section>
            <h2 className="mb-6 text-3xl font-bold text-white">Top 10 Movies of All Time</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {topRatedMovies.map((movie, index) => (
                <div key={movie.id} className="group relative">
                  <div className="absolute -left-4 top-0 z-10 flex h-16 w-16 items-center justify-center text-5xl font-bold text-red-500 transition-transform duration-300 group-hover:scale-125">
                    {index + 1}
                  </div>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>

          <MovieCarousel title="Popular Now" movies={popularMovies} />
          <MovieCarousel title="Trending This Week" movies={trendingMovies} />
        </div>
      </div>
    </div>
  )
}