import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { PlayIcon } from '@heroicons/react/24/solid'
import GenrePill from '../components/GenrePill'
import CastSection from '../components/CastSection'
import SimilarMovies from '../components/SimilarMovies'
import VideoPlayer from '../components/VideoPlayer'
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies } from '../utils/api'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState(null)
  const [similarMovies, setSimilarMovies] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redirectToSeries, setRedirectToSeries] = useState(false)

  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch movie details first
        const details = await fetchMovieDetails(id)

        // If it's a 404, it might be a TV series
        if (!details) {
          setRedirectToSeries(true)
          return
        }

        const [credits, similar] = await Promise.all([
          fetchMovieCredits(id),
          fetchSimilarMovies(id)
        ])

        if (!details) {
          setError('Movie not found')
          setLoading(false)
          return
        }

        setMovie(details)
        setCast(credits?.cast || [])
        setSimilarMovies(similar?.results || [])
      } catch (error) {
        console.error('Error loading movie data:', error)
        setError('Failed to load movie')
      } finally {
        setLoading(false)
      }
    }

    loadMovieData()
  }, [id])

  if (redirectToSeries) {
    return <Navigate to={`/series/${id}`} replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-600 border-t-red-600" />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-3xl font-bold text-white">Movie Not Found</h1>
        <p className="text-gray-400">The movie you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              {movie.title}
            </h1>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="text-lg text-yellow-400">
                ★ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300">
                {movie.release_date.split('-')[0]}
              </span>
              <span className="text-gray-300">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <GenrePill key={genre.id} genre={genre} />
              ))}
            </div>
            <button
              onClick={() => setShowPlayer(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-red-700 hover:scale-105"
            >
              <PlayIcon className="h-6 w-6" />
              Watch Now
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-white">Overview</h2>
            <p className="text-lg text-gray-300">
              {movie.overview}
            </p>
          </div>
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {showPlayer && (
          <VideoPlayer
            mediaId={movie.id}
            type="movie"
            onClose={() => setShowPlayer(false)}
          />
        )}

        <CastSection cast={cast} />
        <SimilarMovies movies={similarMovies} />
      </div>
    </div>
  )
}