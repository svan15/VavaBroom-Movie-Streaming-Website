import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useRef } from 'react'

export default function CastSection({ cast }) {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -scrollRef.current.offsetWidth : scrollRef.current.offsetWidth
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!cast?.length) return null

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Cast & Crew</h2>
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
        {cast.map((person, index) => (
          <div key={`${person.id}-${person.cast_id || index}`} className="flex-none w-32">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                  alt={person.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `data:image/svg+xml,${encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="185" height="278" viewBox="0 0 185 278"><rect width="100%" height="100%" fill="#1f2937"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#4b5563" text-anchor="middle" dy=".3em">No Image</text></svg>'
                    )}`;
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">?</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-white text-sm truncate">{person.name}</h3>
              <p className="text-sm text-gray-400 truncate">{person.character}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}