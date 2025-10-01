import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PlayIcon } from '@heroicons/react/24/solid'
import GenrePill from '../components/GenrePill'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY

async function fetchGenreMovies(genreId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=1`
  )
  const data = await response.json()
  return data.results[0] // Return the most popular movie for this genre
}

export default function Genres() {
  const [movieGenres, setMovieGenres] = useState([])
  const [genreBackdrops, setGenreBackdrops] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
        )
        const data = await response.json()
        setMovieGenres(data.genres)

        // Fetch backdrop images for each genre
        const backdrops = {}
        await Promise.all(
          data.genres.map(async (genre) => {
            const movie = await fetchGenreMovies(genre.id)
            if (movie?.backdrop_path) {
              backdrops[genre.id] = movie.backdrop_path
            }
          })
        )
        setGenreBackdrops(backdrops)
      } catch (error) {
        console.error('Error loading genres:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Genres</h1>
        <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="aspect-video rounded-xl bg-gray-800" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold text-white">Genres</h1>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {movieGenres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${genre.id}`}
            className="group relative aspect-video overflow-hidden rounded-xl bg-gray-900 transition-transform duration-300 hover:-translate-y-1"
          >
            {genreBackdrops[genre.id] && (
              <img
                src={`https://image.tmdb.org/t/p/w780${genreBackdrops[genre.id]}`}
                alt={genre.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">{genre.name}</h2>
              <div className="flex items-center gap-2 rounded-full bg-red-600/80 px-4 py-2 text-sm text-white">
                <PlayIcon className="h-4 w-4" />
                <span>Explore</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}