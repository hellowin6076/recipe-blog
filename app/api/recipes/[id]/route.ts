import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recipes/[id] - 레시피 상세 조회
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          orderBy: { order: 'asc' },
        },
        steps: {
          orderBy: { order: 'asc' },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 })
  }
}

// PUT /api/recipes/[id] - 레시피 수정
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, coverImage, rating, category, notes, ingredients, steps, tags } = body

    // 기존 재료, 스텝 삭제
    await prisma.ingredient.deleteMany({ where: { recipeId: id } })
    await prisma.step.deleteMany({ where: { recipeId: id } })
    await prisma.recipeTag.deleteMany({ where: { recipeId: id } })

    // slug 재생성
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 레시피 업데이트
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        slug,
        coverImage,
        rating: rating || 3,
        category: category || null,
        notes,
        ingredients: {
          create: ingredients.map((ing: any, index: number) => ({
            name: ing.name,
            amount: ing.amount,
            order: index,
          })),
        },
        steps: {
          create: steps.map((step: string, index: number) => ({
            instruction: step,
            order: index,
          })),
        },
        tags: {
          create: await Promise.all(
            tags.map(async (tagName: string) => {
              let tag = await prisma.recipeTagMaster.findUnique({
                where: { name: tagName },
              })

              if (!tag) {
                tag = await prisma.recipeTagMaster.create({
                  data: { name: tagName },
                })
              }

              return {
                tag: {
                  connect: { id: tag.id },
                },
              }
            })
          ),
        },
      },
      include: {
        ingredients: true,
        steps: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Recipe update error:', error)
    return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 })
  }
}

// DELETE /api/recipes/[id] - 레시피 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.recipe.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Recipe deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 })
  }
}