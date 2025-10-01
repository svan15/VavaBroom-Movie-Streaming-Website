import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-black/90 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link to="/" className="text-gray-400 hover:text-white">
              About
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white">
              Terms of Service
            </Link>
            <Link to="/" className="text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 text-center text-sm text-gray-500 md:items-end md:text-right">
            <p>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <div className="flex items-center gap-2">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                alt="TMDB Logo"
                className="h-4"
              />
              <span>
                Powered by{' '}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  TMDB
                </a>
              </span>
            </div>
            <p>© {currentYear} VavaBroom. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}