import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 기존 하드코딩된 카테고리들
const INITIAL_CATEGORIES = [
  { name: '국/찌개', order: 1 },
  { name: '볶음', order: 2 },
  { name: '무침', order: 3 },
  { name: '조림', order: 4 },
  { name: '구이', order: 5 },
  { name: '튀김', order: 6 },
  { name: '찜', order: 7 },
  { name: '전/부침', order: 8 },
  { name: '밥/죽/면', order: 9 },
  { name: '디저트', order: 10 },
  { name: '기타', order: 11 },
]

async function main() {
  console.log('🌱 Seeding categories...')

  for (const category of INITIAL_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
    console.log(`✅ Category: ${category.name}`)
  }

  console.log('✨ Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
