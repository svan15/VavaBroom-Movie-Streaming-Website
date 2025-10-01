// Function to generate embed URL from TMDb movie/series ID
export function getEmbedUrl(mediaId) {
  // Using VidSrc as it provides direct embedding
  return `https://vidsrc.to/embed/${mediaId}`
}

// Function to generate the embed iframe with proper configuration
export function createEmbedIframe(mediaId) {
  return {
    src: getEmbedUrl(mediaId),
    width: '100%',
    height: '100%',
    frameBorder: '0',
    allowFullScreen: true,
    allow: 'encrypted-media; autoplay; fullscreen',
    className: 'aspect-video rounded-lg shadow-lg',
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%'
    }
  }
}

// Function to validate if a video source is available
export async function checkVideoAvailability(mediaId) {
  try {
    const response = await fetch(getEmbedUrl(mediaId), {
      method: 'HEAD'
    })
    return response.ok
  } catch (error) {
    console.error('Error checking video availability:', error)
    return false
  }
}

// Function to format media ID based on type (movie/series)
export function formatMediaId(type, id, seasonEpisode = '') {
  if (type === 'movie') {
    return `movie/${id}`
  } else if (type === 'series' && seasonEpisode) {
    // Format: tv/123/1/2 for Season 1 Episode 2
    return `tv/${id}/${seasonEpisode}`
  } else {
    return `tv/${id}`
  }
}