'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  slug: string
  coverImage: string | null
  createdAt: string
  tags: { tag: { name: string } }[]
}

export default function AdminPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 레시피를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('삭제되었습니다.')
        fetchRecipes()
      } else {
        alert('삭제 실패')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('오류 발생')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-50 p-4 md:p-6">
        <div className="text-center py-12 text-gray-600">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 p-4 md:p-6 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">레시피 관리</h1>
          <Link
            href="/admin/recipe/new"
            className="block md:inline-block w-full md:w-auto px-6 py-4 md:py-3 bg-blue-600 text-white text-center rounded-xl md:rounded-lg text-lg md:text-base font-bold hover:bg-blue-700"
          >
            + 새 레시피 작성
          </Link>
        </div>

        {/* 레시피 목록 */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4 text-lg">아직 작성된 레시피가 없습니다.</p>
            <Link href="/admin/recipe/new" className="text-blue-600 hover:underline text-lg">
              첫 레시피를 작성해보세요!
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white border-2 border-gray-200 rounded-xl md:rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 모바일: 세로 레이아웃 / 웹: 가로 레이아웃 */}
                <div className="md:flex">
                  {/* 이미지 */}
                  {recipe.coverImage && (
                    <div className="md:w-48 md:flex-shrink-0">
                      <img
                        src={recipe.coverImage}
                        alt={recipe.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 내용 */}
                  <div className="flex-1 p-4 md:flex md:items-center md:justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-3 md:mb-2">
                        {recipe.title}
                      </h2>

                      {/* 태그 */}
                      {recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 md:mb-2">
                          {recipe.tags.map((rt) => (
                            <span
                              key={rt.tag.name}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              #{rt.tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* 날짜 */}
                      <p className="text-sm text-gray-500 mb-4 md:mb-0">
                        작성일: {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>

                    {/* 웹: 버튼 세로 배치 */}
                    <div className="hidden md:flex md:flex-col md:gap-2 md:ml-4">
                      <Link
                        href={`/recipes/${recipe.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-gray-200 text-gray-700 text-center rounded hover:bg-gray-300 whitespace-nowrap font-medium"
                      >
                        보기
                      </Link>
                      <Link
                        href={`/admin/recipe/${recipe.id}`}
                        className="px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600 whitespace-nowrap font-medium"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe.id, recipe.title)}
                        className="px-4 py-2 bg-red-500 text-white text-center rounded hover:bg-red-600 whitespace-nowrap font-medium"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>

                {/* 모바일: 버튼 가로 배치 */}
                <div className="grid grid-cols-3 gap-0 border-t-2 border-gray-200 md:hidden">
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    target="_blank"
                    className="px-4 py-4 bg-gray-100 text-gray-700 text-center font-medium border-r border-gray-300"
                  >
                    보기
                  </Link>
                  <Link
                    href={`/admin/recipe/${recipe.id}`}
                    className="px-4 py-4 bg-blue-50 text-blue-600 text-center font-medium border-r border-gray-300"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id, recipe.title)}
                    className="px-4 py-4 bg-red-50 text-red-600 text-center font-medium"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
