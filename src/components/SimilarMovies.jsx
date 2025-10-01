import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'
import MovieCard from './MovieCard'

export default function SimilarMovies({ movies }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!movies?.length) return null

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="rounded-full p-2 hover:bg-gray-800"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-full p-2 hover:bg-gray-800"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
}