import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './index.css'

// Import all the route components
import Home from './pages/Home'
import Movies from './pages/Movies'
import Series from './pages/Series'
import Genres from './pages/Genres'
import Genre from './pages/Genre'
import Search from './pages/Search'
import MovieDetail from './pages/MovieDetail'
import SeriesDetail from './pages/SeriesDetail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/movies', element: <Movies /> },
      { path: '/series', element: <Series /> },
      { path: '/genres', element: <Genres /> },
      { path: '/genre/:id', element: <Genre /> },
      { path: '/search', element: <Search /> },
      { path: '/movie/:id', element: <MovieDetail /> },
      { path: '/series/:id', element: <SeriesDetail /> }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)