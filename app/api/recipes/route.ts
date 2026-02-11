import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/recipes - 레시피 목록
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 })
  }
}

// POST /api/recipes - 레시피 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, coverImage, rating, category, notes, ingredients, steps, tags } = body

    // slug 생성 (간단 버전)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 레시피 생성
    const recipe = await prisma.recipe.create({
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
              // 태그가 이미 있으면 찾고, 없으면 생성
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

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Recipe creation error:', error)
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 })
  }
}