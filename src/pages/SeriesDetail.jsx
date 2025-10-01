import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { PlayIcon } from '@heroicons/react/24/solid'
import GenrePill from '../components/GenrePill'
import CastSection from '../components/CastSection'
import SimilarMovies from '../components/SimilarMovies'
import VideoPlayer from '../components/VideoPlayer'
import { fetchSeriesDetails, fetchSeriesCredits, fetchSeriesEpisodes, fetchSimilarSeries } from '../utils/api'

export default function SeriesDetail() {
  const { id } = useParams()
  const [series, setSeries] = useState(null)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [episodes, setEpisodes] = useState([])
  const [cast, setCast] = useState(null)
  const [similarSeries, setSimilarSeries] = useState(null)
  const [showPlayer, setShowPlayer] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redirectToMovie, setRedirectToMovie] = useState(false)

  useEffect(() => {
    const loadSeriesData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Try to fetch series details first
        const details = await fetchSeriesDetails(id)

        // If it's a 404, it might be a movie
        if (!details) {
          setRedirectToMovie(true)
          return
        }

        const [credits, similar] = await Promise.all([
          fetchSeriesCredits(id),
          fetchSimilarSeries(id)
        ])

        if (!details) {
          setError('Series not found')
          return
        }

        setSeries(details)
        setCast(credits?.cast || [])
        setSimilarSeries(similar?.results || [])

        if (details.seasons?.length > 0) {
          const seasonData = await fetchSeriesEpisodes(id, 1)
          setEpisodes(seasonData?.episodes || [])
        }
      } catch (error) {
        console.error('Error loading series data:', error)
        setError('Failed to load series')
      } finally {
        setLoading(false)
      }
    }

    loadSeriesData()
  }, [id])

  const handleSeasonChange = async (seasonNumber) => {
    try {
      setSelectedSeason(seasonNumber)
      const seasonData = await fetchSeriesEpisodes(id, seasonNumber)
      setEpisodes(seasonData.episodes)
    } catch (error) {
      console.error('Error loading season data:', error)
    }
  }

  if (redirectToMovie) {
    return <Navigate to={`/movie/${id}`} replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-600 border-t-red-600" />
      </div>
    )
  }

  if (error || !series) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-3xl font-bold text-white">Series Not Found</h1>
        <p className="text-gray-400">{error || "The series you're looking for doesn't exist or has been removed."}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
          alt={series.name}
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
              {series.name}
            </h1>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="text-lg text-yellow-400">
                ★ {series.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300">
                {series.first_air_date?.split('-')[0]}
              </span>
              <span className="text-gray-300">
                {series.number_of_seasons} Seasons
              </span>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {series.genres.map((genre) => (
                <GenrePill key={genre.id} genre={genre} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-white">Overview</h2>
            <p className="text-lg text-gray-300">
              {series.overview}
            </p>

            {/* Season Selection */}
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold text-white">Episodes</h3>
              <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                {series.seasons?.map((season) => (
                  <button
                    key={season.season_number}
                    onClick={() => handleSeasonChange(season.season_number)}
                    className={`flex-none rounded-full px-4 py-2 font-medium transition-colors ${
                      selectedSeason === season.season_number
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>

              {/* Episodes List */}
              <div className="grid gap-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="group rounded-lg bg-gray-800 p-4 transition-colors hover:bg-gray-700"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-white">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-400">
                          {episode.overview}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEpisode(episode)
                          setShowPlayer(true)
                        }}
                        className="flex-none rounded-full bg-red-600 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <PlayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <img
              src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
              alt={series.name}
              className="w-full rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {showPlayer && selectedEpisode && (
          <VideoPlayer
            mediaId={id}
            type="series"
            season={selectedSeason}
            episode={selectedEpisode.episode_number}
            onClose={() => {
              setShowPlayer(false)
              setSelectedEpisode(null)
            }}
          />
        )}

        <CastSection cast={cast} />
        <SimilarMovies movies={similarSeries?.map(show => ({
          id: show.id,
          title: show.name,
          poster_path: show.poster_path,
          vote_average: show.vote_average,
          release_date: show.first_air_date
        }))} />
      </div>
    </div>
  )
}