import Link from 'next/link'

async function getRecipes() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  
  const res = await fetch(`${baseUrl}/api/recipes`, { cache: 'no-store' })
  if (!res.ok) {
    console.error('Failed to fetch recipes:', res.status)
    return []
  }
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
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">레시피 블로그</h1>
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
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
              >
                {/* 이미지 */}
                {recipe.coverImage ? (
                  <img
                    src={recipe.coverImage}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지 없음</span>
                  </div>
                )}

                {/* 내용 */}
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h2>

                  {/* 태그 */}
                  {recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {recipe.tags.map((rt) => (
                        <span
                          key={rt.tag.name}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                        >
                          #{rt.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 날짜 */}
                  <p className="text-sm text-gray-500">
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
