import { Link } from 'react-router-dom'

export default function GenrePill({ genre }) {
  return (
    <Link
      to={`/genre/${genre.id}`}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-300 
                 ring-1 ring-gray-700 transition-all hover:text-white 
                 hover:ring-gray-600 hover:bg-gray-800/50"
    >
      {genre.name}
    </Link>
  )
}