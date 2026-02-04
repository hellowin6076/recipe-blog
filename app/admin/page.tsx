'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Recipe {
  id: string
  title: string
  slug: string
  coverImage: string | null
  createdAt: string
  tags: { tag: { name: string } }[]
}

export default function AdminPage() {
  const router = useRouter()
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
        fetchRecipes() // 목록 새로고침
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
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">레시피 관리</h1>
        <Link
          href="/admin/recipe/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + 새 레시피 작성
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">아직 작성된 레시피가 없습니다.</p>
          <Link
            href="/admin/recipe/new"
            className="text-blue-600 hover:underline"
          >
            첫 레시피를 작성해보세요!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
            >
              {/* 이미지 */}
              {recipe.coverImage && (
                <img
                  src={recipe.coverImage}
                  alt={recipe.title}
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              {/* 정보 */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                
                {/* 태그 */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {recipe.tags.map((rt) => (
                    <span
                      key={rt.tag.name}
                      className="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      #{rt.tag.name}
                    </span>
                  ))}
                </div>

                {/* 날짜 */}
                <p className="text-sm text-gray-500">
                  작성일: {new Date(recipe.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/recipes/${recipe.slug}`}
                  target="_blank"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-center"
                >
                  보기
                </Link>
                <Link
                  href={`/admin/recipe/${recipe.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
                >
                  수정
                </Link>
                <button
                  onClick={() => handleDelete(recipe.id, recipe.title)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}