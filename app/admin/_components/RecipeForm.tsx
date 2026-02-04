'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Ingredient {
  name: string
  amount: string
}

interface RecipeFormProps {
  recipeId?: string  // 있으면 수정 모드, 없으면 작성 모드
}

export default function RecipeForm({ recipeId }: RecipeFormProps) {
  const router = useRouter()
  const isEditMode = !!recipeId
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  
  // 폼 상태
  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '' }
  ])
  const [steps, setSteps] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tip, setTip] = useState('')

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (isEditMode && recipeId) {
      setFetching(true)
      fetch(`/api/recipes/${recipeId}`)
        .then(res => res.json())
        .then(data => {
          setTitle(data.title)
          setCoverImage(data.coverImage || '')
          setIngredients(data.ingredients.map((ing: any) => ({
            name: ing.name,
            amount: ing.amount
          })))
          setSteps(data.steps.map((step: any) => step.instruction))
          setTags(data.tags.map((rt: any) => rt.tag.name))
          setTip(data.tip || '')
        })
        .catch(error => {
          console.error('Failed to fetch recipe:', error)
          alert('레시피를 불러오는데 실패했습니다.')
        })
        .finally(() => setFetching(false))
    }
  }, [isEditMode, recipeId])

  // 재료 관련 함수
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  // 단계 관련 함수
  const addStep = () => {
    setSteps([...steps, ''])
  }

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  // 태그 관련 함수
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const url = isEditMode ? `/api/recipes/${recipeId}` : '/api/recipes'
    const method = isEditMode ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          coverImage: coverImage || null,
          ingredients: ingredients.filter(ing => ing.name && ing.amount),
          steps: steps.filter(step => step.trim()),
          tags,
          tip: tip || null,
        }),
      })

      if (response.ok) {
        alert(isEditMode ? '레시피가 수정되었습니다!' : '레시피가 저장되었습니다!')
        router.push('/admin')
      } else {
        alert('저장 실패')
      }
    } catch (error) {
      console.error(error)
      alert('오류 발생')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="text-center py-12">로딩 중...</div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium mb-2">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="레시피 제목"
        />
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className="block text-sm font-medium mb-2">대표 이미지 URL</label>
        <input
          type="text"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="https://..."
        />
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm font-medium mb-2">태그</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag()
              }
            }}
            className="flex-1 px-4 py-2 border rounded-lg"
            placeholder="태그 입력 후 엔터"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 재료 */}
      <div>
        <label className="block text-sm font-medium mb-2">재료 *</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              placeholder="재료명"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={ingredient.amount}
              onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
              placeholder="수량"
              className="w-32 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeIngredient(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + 재료 추가
        </button>
      </div>

      {/* 조리 과정 */}
      <div>
        <label className="block text-sm font-medium mb-2">조리 과정 *</label>
        {steps.map((step, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <span className="px-4 py-2 bg-gray-100 rounded-lg min-w-[3rem] text-center">
              {index + 1}.
            </span>
            <input
              type="text"
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              placeholder="조리 단계"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStep}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          + 단계 추가
        </button>
      </div>

      {/* 팁 */}
      <div>
        <label className="block text-sm font-medium mb-2">팁 (선택)</label>
        <textarea
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="요리 팁이나 메모"
        />
      </div>

      {/* 제출 */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-400 hover:bg-blue-700"
        >
          {loading ? '저장 중...' : isEditMode ? '수정하기' : '저장 및 공개하기'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  )
}