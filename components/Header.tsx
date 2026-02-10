import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-wider hover:text-gray-700 transition">
            RECIPE BLOG
          </Link>
          
          {/* Navigation Menu */}
          <ul className="flex items-center gap-4 sm:gap-8 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-gray-600 transition">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-gray-600 transition">
                BLOG
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray-600 transition">
                ABOUT
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
