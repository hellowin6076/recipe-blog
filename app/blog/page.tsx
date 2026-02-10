'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import PostCard from '@/components/PostCard'

interface Recipe {
  id: string
  title: string
  slug: string
  coverImage: string | null
  createdAt: string
  difficulty?: number
  category?: string
  tags: { tag: { name: string } }[]
}

// Mock data for likes and comments
const mockStats: { [key: string]: { comments: number } } = {}

export default function BlogPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const res = await fetch(`${baseUrl}/api/recipes`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setRecipes(data)
        setFilteredRecipes(data)
      }
    }
    fetchRecipes()
  }, [])

  // 카테고리와 태그 추출
  const categories = Array.from(new Set(recipes.map(r => r.category).filter(Boolean))) as string[]
  const allTags = Array.from(
    new Set(recipes.flatMap(r => r.tags.map(t => t.tag.name)))
  )

  // 카테고리별 개수
  const getCategoryCount = (category: string) => {
    return recipes.filter(r => r.category === category).length
  }

  // 태그별 개수
  const getTagCount = (tag: string) => {
    return recipes.filter(r => r.tags.some(t => t.tag.name === tag)).length
  }

  // 필터링
  useEffect(() => {
    let filtered = recipes

    if (selectedCategory) {
      filtered = filtered.filter(r => r.category === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter(r => r.tags.some(t => t.tag.name === selectedTag))
    }

    setFilteredRecipes(filtered)
  }, [selectedCategory, selectedTag, recipes])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 tracking-wide">
          ALL RECIPES
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">카테고리</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === null
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      전체 ({recipes.length})
                    </button>
                  </li>
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded transition ${
                          selectedCategory === category
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {category} ({getCategoryCount(category)})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div>
                <h3 className="font-bold text-lg mb-4">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`px-3 py-1 rounded-full text-sm transition ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{tag} ({getTagCount(tag)})
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedTag) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedTag(null)
                  }}
                  className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium transition"
                >
                  필터 초기화
                </button>
              )}
            </div>
          </aside>

          {/* Recipe List */}
          <div className="flex-1">
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {recipes.length === 0 ? '아직 레시피가 없습니다.' : '조건에 맞는 레시피가 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {filteredRecipes.map((recipe) => (
                  <PostCard 
                    key={recipe.id} 
                    recipe={recipe}
                    comments={mockStats[recipe.id]?.comments || Math.floor(Math.random() * 20)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
