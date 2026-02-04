import RecipeForm from '../../_components/RecipeForm'

export default function NewRecipePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">새 레시피 작성</h1>
      <RecipeForm />
    </div>
  )
}