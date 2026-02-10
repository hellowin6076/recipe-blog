import Link from 'next/link'

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

interface PostCardProps {
  recipe: Recipe
}

export default function PostCard({ recipe }: PostCardProps) {
  // 난이도를 별로 표시
  const renderStars = (difficulty: number = 3) => {
    return '⭐'.repeat(difficulty)
  }

  return (
    <Link href={`/recipes/${recipe.slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:grid sm:grid-cols-[240px_1fr] gap-0 sm:gap-6">
          {/* Image */}
          <div className="relative h-48 sm:h-auto bg-gradient-to-br from-yellow-100 to-orange-100">
            {recipe.coverImage ? (
              <img 
                src={recipe.coverImage} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-5xl sm:text-6xl">🍳</span>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-5 sm:p-6 sm:pr-8 flex flex-col justify-between">
            <div>
              {/* Meta - Date */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span>{new Date(recipe.createdAt).toLocaleDateString('ko-KR')}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold mb-3 hover:text-gray-700 transition">
                {recipe.title}
              </h3>
              
              {/* Tags */}
              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {recipe.tags.slice(0, 3).map((rt) => (
                    <span
                      key={rt.tag.name}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs sm:text-sm font-medium"
                    >
                      #{rt.tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Difficulty & Category */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {/* Difficulty */}
                {recipe.difficulty && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 font-medium">난이도:</span>
                    <span>{renderStars(recipe.difficulty)}</span>
                  </div>
                )}
                
                {/* Category */}
                {recipe.category && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span>🍜</span>
                    <span className="font-medium">{recipe.category}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bottom Meta - Comments */}
            <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1.5 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <span 
                  className="text-sm disqus-comment-count" 
                  data-disqus-identifier={recipe.slug}
                >
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
