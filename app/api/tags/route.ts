import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tags - 태그 목록 (자동완성용)
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}
