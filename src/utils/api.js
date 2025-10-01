const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

const defaultOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
}

async function fetchFromTMDb(endpoint, options = {}) {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`)
    url.searchParams.append('api_key', TMDB_API_KEY)
    
    const response = await fetch(url.toString(), {
      ...defaultOptions,
      ...options,
    })
    
    if (response.status === 404) {
      return null
    }
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching from TMDB:', error)
    return null
  }
}

export function fetchPopularMovies(page = 1) {
  return fetchFromTMDb(`/movie/popular?page=${page}`)
}

export function fetchTopRatedMovies(page = 1) {
  return fetchFromTMDb(`/movie/top_rated?page=${page}`)
}

export function fetchTrendingMovies(timeWindow = 'day') {
  return fetchFromTMDb(`/trending/movie/${timeWindow}`)
}

export function fetchGenres() {
  return fetchFromTMDb('/genre/movie/list')
}

export function fetchMoviesByGenre(genreId, page = 1, sortBy = 'popularity.desc') {
  return fetchFromTMDb(
    `/discover/movie?with_genres=${genreId}&page=${page}&sort_by=${sortBy}&vote_count.gte=100`
  )
}

export function fetchMovieDetails(movieId) {
  return fetchFromTMDb(`/movie/${movieId}`)
}

export function fetchMovieCredits(movieId) {
  return fetchFromTMDb(`/movie/${movieId}/credits`)
}

export function fetchSimilarMovies(movieId) {
  return fetchFromTMDb(`/movie/${movieId}/similar`)
}

export function fetchGenreDetails(genreId) {
  return fetchGenres().then(data => {
    const genre = data.genres.find(g => g.id.toString() === genreId.toString())
    if (!genre) throw new Error('Genre not found')
    return genre
  })
}

export function searchMovies(query, page = 1) {
  return fetchFromTMDb(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
}

// TV Series functions
export async function fetchSeriesDetails(seriesId) {
  try {
    const data = await fetchFromTMDb(`/tv/${seriesId}?append_to_response=external_ids,content_ratings`)
    if (!data) return null
    return {
      ...data,
      media_type: 'tv'
    }
  } catch {
    return null
  }
}

export async function fetchSeriesEpisodes(seriesId, seasonNumber) {
  try {
    const data = await fetchFromTMDb(`/tv/${seriesId}/season/${seasonNumber}`)
    if (!data?.episodes) return { episodes: [] }
    return data
  } catch {
    return { episodes: [] }
  }
}

export async function fetchPopularSeries(page = 1) {
  const data = await fetchFromTMDb(`/tv/popular?page=${page}`)
  if (!data?.results) return { results: [] }
  return {
    ...data,
    results: data.results.map(series => ({
      ...series,
      media_type: 'tv'
    }))
  }
}

export async function fetchTopRatedSeries(page = 1) {
  const data = await fetchFromTMDb(`/tv/top_rated?page=${page}`)
  if (!data?.results) return { results: [] }
  return {
    ...data,
    results: data.results.map(series => ({
      ...series,
      media_type: 'tv'
    }))
  }
}

export async function fetchTrendingSeries(timeWindow = 'day') {
  const data = await fetchFromTMDb(`/trending/tv/${timeWindow}`)
  if (!data?.results) return { results: [] }
  return {
    ...data,
    results: data.results.map(series => ({
      ...series,
      media_type: 'tv'
    }))
  }
}

export async function fetchSeriesCredits(seriesId) {
  try {
    const data = await fetchFromTMDb(`/tv/${seriesId}/credits`)
    if (!data?.cast) return { cast: [] }
    return data
  } catch {
    return { cast: [] }
  }
}

export async function fetchSimilarSeries(seriesId) {
  try {
    const data = await fetchFromTMDb(`/tv/${seriesId}/similar`)
    if (!data?.results) return { results: [] }
    return {
      ...data,
      results: data.results.map(series => ({
        ...series,
        media_type: 'tv'
      }))
    }
  } catch {
    return { results: [] }
  }
}



