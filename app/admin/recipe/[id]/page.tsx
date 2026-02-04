import { use } from 'react'
import RecipeForm from '../../_components/RecipeForm'

export default function EditRecipePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params)
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">레시피 수정</h1>
      <RecipeForm recipeId={resolvedParams.id} />
    </div>
  )
}