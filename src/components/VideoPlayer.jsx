import { XMarkIcon } from '@heroicons/react/24/outline'
import { createEmbedIframe, formatMediaId } from '../utils/embed'

export default function VideoPlayer({ mediaId, type = 'movie', season, episode, onClose }) {
  const formattedMediaId = formatMediaId(
    type,
    mediaId,
    season && episode ? `${season}/${episode}` : ''
  )
  const iframeProps = createEmbedIframe(formattedMediaId)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -right-4 -top-12 rounded-full p-2 text-white transition-colors hover:text-red-500"
          aria-label="Close video player"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        
        <div className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-600" />
          </div>
          
          <iframe
            {...iframeProps}
            onLoad={(e) => {
              // Hide loading spinner when iframe loads
              const parent = e.target.parentElement
              const loader = parent.querySelector('div')
              if (loader) loader.style.display = 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}