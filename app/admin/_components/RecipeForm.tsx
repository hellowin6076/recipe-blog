'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'

interface Ingredient {
  name: string
  amount: string
}

interface RecipeFormProps {
  recipeId?: string
}

// 카테고리 옵션
const CATEGORIES = [
  '국/찌개',
  '볶음',
  '무침',
  '조림',
  '구이',
  '튀김',
  '찜',
  '전/부침',
  '밥/죽/면',
  '디저트',
  '기타'
]

export default function RecipeForm({ recipeId }: RecipeFormProps) {
  const router = useRouter()
  const isEditMode = !!recipeId

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [title, setTitle] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [difficulty, setDifficulty] = useState(3) // 1-5
  const [category, setCategory] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
  const [steps, setSteps] = useState<string[]>([''])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [tip, setTip] = useState('')

  useEffect(() => {
    if (isEditMode && recipeId) {
      setFetching(true)
      fetch(`/api/recipes/${recipeId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title)
          setCoverImage(data.coverImage || '')
          setDifficulty(data.difficulty || 3)
          setCategory(data.category || '')
          setIngredients(
            data.ingredients.map((ing: any) => ({
              name: ing.name,
              amount: ing.amount,
            }))
          )
          setSteps(data.steps.map((step: any) => step.instruction))
          setTags(data.tags.map((rt: any) => rt.tag.name))
          setTip(data.tip || '')
        })
        .catch((error) => {
          console.error('Failed to fetch recipe:', error)
          alert('레시피를 불러오는데 실패했습니다.')
        })
        .finally(() => setFetching(false))
    }
  }, [isEditMode, recipeId])

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

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // 이미지 압축 옵션
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/jpeg',
      }

      // 압축
      console.log('원본 크기:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      const compressedFile = await imageCompression(file, options)
      console.log('압축 후 크기:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB')

      // 업로드
      const formData = new FormData()
      formData.append('file', compressedFile)

      // 기존 이미지 URL 전달 (있으면)
      if (coverImage) {
        formData.append('oldUrl', coverImage)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setCoverImage(data.url)
        alert('이미지 업로드 완료!')
      } else {
        alert('업로드 실패')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드 오류')
    } finally {
      setUploading(false)
    }
  }

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
          difficulty,
          category: category || null,
          ingredients: ingredients.filter((ing) => ing.name && ing.amount),
          steps: steps.filter((step) => step.trim()),
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
    return <div className="text-center py-12 text-gray-600">로딩 중...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-6 pb-8">
      {/* 제목 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="레시피 제목"
        />
      </div>

      {/* 난이도 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          난이도 *
        </label>
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`text-3xl transition ${
                level <= difficulty ? 'opacity-100' : 'opacity-30'
              } hover:opacity-100`}
            >
              ⭐
            </button>
          ))}
          <span className="text-sm text-gray-600 ml-2">
            ({difficulty === 1 ? '매우 쉬움' : difficulty === 2 ? '쉬움' : difficulty === 3 ? '보통' : difficulty === 4 ? '어려움' : '매우 어려움'})
          </span>
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          카테고리
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
        >
          <option value="">선택 안 함</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          대표 이미지
        </label>

        <div className="mb-3 md:mb-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:text-sm"
          />
          {uploading && <p className="text-sm text-gray-500 mt-2">이미지 압축 및 업로드 중...</p>}
        </div>

        <div>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="또는 URL 직접 입력"
          />
        </div>

        {coverImage && (
          <div className="mt-3 md:mt-2">
            <img src={coverImage} alt="미리보기" className="w-full md:w-48 rounded-lg" />
          </div>
        )}
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">태그</label>
        <div className="flex gap-2">
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
            className="flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
            placeholder="태그 입력 후 엔터"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-6 md:px-4 py-3 md:py-2 bg-blue-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-blue-600"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 md:mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-2 md:py-1 bg-gray-200 text-gray-900 rounded-full text-base md:text-sm flex items-center gap-2"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-500 hover:text-red-700 text-xl md:text-lg font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 재료 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">재료 *</label>
        <div className="space-y-3 md:space-y-2">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 md:p-3 rounded-lg space-y-3 md:space-y-0 md:flex md:gap-2 md:items-start border border-gray-200"
            >
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                placeholder="재료명"
                className="w-full md:flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
              />
              <input
                type="text"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                placeholder="수량"
                className="w-full md:w-32 px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="w-full md:w-auto px-4 py-3 md:py-2 bg-red-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="w-full mt-3 md:mt-2 px-4 py-3 md:py-2 bg-green-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-green-600"
        >
          + 재료 추가
        </button>
      </div>

      {/* 조리 과정 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          조리 과정 *
        </label>
        <div className="space-y-3 md:space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 md:p-3 rounded-lg space-y-3 md:space-y-0 md:flex md:gap-2 md:items-start border border-gray-200"
            >
              <span className="inline-block md:inline-block px-4 py-2 md:py-2 bg-gray-200 text-gray-900 rounded-lg text-base md:text-sm font-medium min-w-[50px] md:min-w-[40px] text-center">
                {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => updateStep(index, e.target.value)}
                placeholder="조리 단계 설명"
                rows={3}
                className="w-full md:flex-1 px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="w-full md:w-auto px-4 py-3 md:py-2 bg-red-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-red-600 md:self-start"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="w-full mt-3 md:mt-2 px-4 py-3 md:py-2 bg-green-500 text-white rounded-lg text-base md:text-sm font-medium hover:bg-green-600"
        >
          + 단계 추가
        </button>
      </div>

      {/* 팁 */}
      <div>
        <label className="block text-sm md:text-base font-medium mb-2 text-gray-900">
          팁 (선택)
        </label>
        <textarea
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-lg text-base md:text-sm text-gray-900"
          placeholder="요리 팁이나 메모"
        />
      </div>

      {/* 제출 */}
      <div className="space-y-3 md:space-y-0 md:flex md:gap-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:flex-1 px-6 py-4 md:py-3 bg-blue-600 text-white rounded-lg text-lg md:text-base font-bold disabled:bg-gray-400 hover:bg-blue-700"
        >
          {loading ? '저장 중...' : isEditMode ? '수정하기' : '저장 및 공개하기'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="w-full md:w-auto px-6 py-4 md:py-3 bg-gray-200 text-gray-900 rounded-lg text-lg md:text-base font-medium hover:bg-gray-300"
        >
          취소
        </button>
      </div>
    </form>
  )
}
