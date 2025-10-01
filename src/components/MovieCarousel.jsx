import { useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import MovieCard from './MovieCard'

export default function MovieCarousel({ title, movies }) {
  const scrollRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' 
        ? -scrollRef.current.clientWidth 
        : scrollRef.current.clientWidth
      
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })

      // Update arrows after scroll animation
      setTimeout(checkArrows, 300)
    }
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className={`rounded-full p-2 transition-all duration-300 ${
              showLeftArrow
                ? 'bg-gray-800 text-white opacity-100 hover:bg-gray-700'
                : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!showLeftArrow}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`rounded-full p-2 transition-all duration-300 ${
              showRightArrow
                ? 'bg-gray-800 text-white opacity-100 hover:bg-gray-700'
                : 'pointer-events-none opacity-0'
            }`}
            aria-hidden={!showRightArrow}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkArrows}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-[180px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
}