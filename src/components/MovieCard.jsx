import { Link } from 'react-router-dom'
import { PlayIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/20/solid'

export default function MovieCard({ movie }) {
  const rating = movie.vote_average.toFixed(1)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''
  
  // Determine if this is a series based on whether it has first_air_date or name property
  const isSeries = 'first_air_date' in movie || 'name' in movie
  const title = movie.name || movie.title

  return (
    <Link 
      to={`/${isSeries ? 'series' : 'movie'}/${movie.id}`}
      state={{ type: isSeries ? 'series' : 'movie' }} 
      className="group relative block transform transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
        {/* Poster Image */}
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={title}
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="100%" height="100%" fill="#1f2937"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#4b5563" text-anchor="middle" dy=".3em">No Poster</text></svg>'
              )}`;
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-800 flex items-center justify-center">
            <span className="text-lg text-gray-600">No Poster</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute right-2 top-2 flex h-8 items-center rounded-full bg-black/75 px-2 text-sm font-medium backdrop-blur-sm">
          <StarIcon className="mr-1 h-4 w-4 text-yellow-400" />
          <span className="text-yellow-400">{rating}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
              <PlayIcon className="h-7 w-7" />
            </div>
          </div>

          {/* Movie Info */}
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="mb-1 text-lg font-semibold text-white line-clamp-2">
              {title}
            </h3>
            {year && (
              <p className="text-sm text-gray-300">
                {year}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}