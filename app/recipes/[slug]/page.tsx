import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getRecipe(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // slug 디코딩 (한글 처리)
  const decodedSlug = decodeURIComponent(slug)

  const res = await fetch(`${baseUrl}/api/recipes`, {
    cache: 'no-store',
  })
  if (!res.ok) return null

  const recipes = await res.json()
  return recipes.find((r: any) => r.slug === decodedSlug)
}

interface Recipe {
  id: string
  title: string
  slug: string
  coverImage: string | null
  tip: string | null
  createdAt: string
  ingredients: { name: string; amount: string }[]
  steps: { instruction: string; order: number }[]
  tags: { tag: { name: string } }[]
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe: Recipe | null = await getRecipe(slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-600 hover:underline">
            ← 목록으로
          </Link>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* 제목 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>

          {/* 태그 */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((rt) => (
                <span
                  key={rt.tag.name}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                >
                  #{rt.tag.name}
                </span>
              ))}
            </div>
          )}

          {/* 날짜 */}
          <p className="text-sm text-gray-500 mb-8">
            {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
          </p>

          {/* 상단 광고 공간 (여백) */}
          <div className="mb-8"></div>

          {/* 이미지 + 재료 (2단 레이아웃) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* 왼쪽: 이미지 */}
            <div>
              {recipe.coverImage ? (
                <img
                  src={recipe.coverImage}
                  alt={recipe.title}
                  className="w-full max-h-[35vh] object-cover rounded-lg sticky top-4"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">이미지 없음</span>
                </div>
              )}
            </div>

            {/* 오른쪽: 재료 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">재료</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, index) => (
                  <li key={index} className="flex items-center text-gray-700 text-lg">
                    <span className="mr-2">•</span>
                    <span className="font-medium">{ing.name}</span>
                    <span className="mx-2 text-gray-400">-</span>
                    <span>{ing.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 중간 광고 공간 (여백) */}
          <div className="mb-12"></div>

          {/* 조리 과정 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">조리 과정</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 text-lg pt-1">{step.instruction}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* 하단 광고 공간 (여백) */}
          <div className="mb-12"></div>

          {/* 팁 */}
          {recipe.tip && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">팁</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-gray-700 text-lg">{recipe.tip}</p>
              </div>
            </section>
          )}

          {/* 최하단 광고 공간 (여백) */}
          <div className="mb-8"></div>

          {/* 목록으로 버튼 */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}