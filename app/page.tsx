import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getRecipes() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const res = await fetch(`${baseUrl}/api/recipes`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

interface Recipe {
  id: string
  title: string
  slug: string
  coverImage: string | null
  createdAt: string
  tags: { tag: { name: string } }[]
}

export default async function HomePage() {
  const recipes: Recipe[] = await getRecipes()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img src="/favicon.ico" alt="로고" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-gray-900">레시피 블로그</h1>
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                홈
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-gray-900 font-medium transition"
              >
                소개
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">아직 레시피가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* 이미지 */}
                {recipe.coverImage ? (
                  <div className="overflow-hidden">
                    <img
                      src={recipe.coverImage}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}

                {/* 내용 */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {recipe.title}
                  </h2>

                  {/* 태그 */}
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipe.tags.map((rt) => (
                        <span
                          key={rt.tag.name}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                        >
                          #{rt.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 날짜 */}
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}