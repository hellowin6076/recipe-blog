import RecipeForm from '../../_components/RecipeForm'

export default function NewRecipePage() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">  {/* bg-white 추가 */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">새 레시피 작성</h1>
        <RecipeForm />
      </div>
    </div>
  )
}