# DevRecipe

> 개발자의 요리 아카이브

Next.js 기반의 한국 레시피 블로그입니다. 오사카에서 한국 요리를 만들며 기록하는 공간입니다.

## 🎯 주요 기능

### 사용자 기능
- 📝 레시피 목록 및 상세 보기
- 🔍 카테고리 및 태그 필터링
- ⭐ 난이도별 레시피 검색
- 💬 Disqus 댓글 시스템
- 📱 완벽한 모바일 반응형 디자인

### 관리자 기능
- ✏️ 레시피 작성/수정/삭제
- 🖼️ 이미지 업로드 및 자동 압축
- 🏷️ 태그 및 카테고리 관리
- ⭐ 난이도 설정 (1-5단계)

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Image Processing**: browser-image-compression
- **Comments**: Disqus

### Deployment
- **Hosting**: Vercel
- **Database**: Vercel Postgres (또는 Supabase)

## 📦 설치 및 실행

### 1. 클론 및 의존성 설치

\`\`\`bash
git clone https://github.com/hellowin6076/recipe-blog.git
cd recipe-blog
npm install
\`\`\`

### 2. 환경 변수 설정

\`.env.local\` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`env
# Database
DATABASE_URL="postgresql://..."

# Public URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
\`\`\`

### 3. 데이터베이스 마이그레이션

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

http://localhost:3000 에서 확인하실 수 있습니다.

## 📁 프로젝트 구조

\`\`\`
recipe-blog/
├── app/
│   ├── page.tsx              # 홈페이지
│   ├── blog/
│   │   └── page.tsx         # 전체 레시피 목록 (필터링)
│   ├── about/
│   │   └── page.tsx         # 소개 페이지
│   ├── recipes/
│   │   └── [slug]/
│   │       └── page.tsx     # 개별 레시피 상세
│   ├── admin/               # 관리자 페이지
│   │   ├── page.tsx         # 레시피 관리 대시보드
│   │   ├── recipe/
│   │   │   ├── new/
│   │   │   │   └── page.tsx # 새 레시피 작성
│   │   │   └── [id]/
│   │   │       └── page.tsx # 레시피 수정
│   │   └── _components/
│   │       └── RecipeForm.tsx
│   └── api/
│       ├── recipes/
│       │   ├── route.ts     # 레시피 목록/생성
│       │   └── [id]/
│       │       └── route.ts # 레시피 조회/수정/삭제
│       ├── tags/
│       │   └── route.ts     # 태그 관리
│       └── upload/
│           └── route.ts     # 이미지 업로드
├── components/
│   ├── Header.tsx           # 공통 헤더
│   ├── PostCard.tsx         # 레시피 카드
│   └── DisqusComments.tsx   # 댓글 컴포넌트
├── prisma/
│   └── schema.prisma        # DB 스키마
└── public/
    └── hero.svg             # 히어로 이미지
\`\`\`

## 🗄️ 데이터베이스 스키마

### Recipe (레시피)
- 제목, 슬러그, 커버 이미지
- 난이도 (1-5)
- 카테고리
- 팁

### Ingredient (재료)
- 이름, 수량, 순서

### Step (조리 과정)
- 설명, 순서

### Tag (태그)
- 이름

## 🎨 카테고리

- 국/찌개
- 볶음
- 무침
- 조림
- 구이
- 튀김
- 찜
- 전/부침
- 밥/죽/면
- 디저트
- 기타

## 💬 댓글 시스템 설정

Disqus를 사용합니다. 설정 방법:

1. [Disqus](https://disqus.com) 가입
2. 사이트 등록 후 Shortname 받기
3. \`components/DisqusComments.tsx\`에서 shortname 변경:
   \`\`\`tsx
   shortname="your-shortname-here"
   \`\`\`

## 🚀 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포

### 환경 변수 (Production)

\`\`\`env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"
\`\`\`

## 📝 TODO

- [ ] 검색 기능 추가
- [ ] 레시피 인쇄 기능
- [ ] 레시피 북마크
- [ ] 조리 시간 필드 추가
- [ ] 영양 정보 추가
- [ ] SEO 최적화

## 👤 Author

**bufgix**
- GitHub: [@hellowin6076](https://github.com/hellowin6076)
- Blog: [DevRecipe](https://recipe-blog-eight-mu.vercel.app)

## 📄 License

MIT License

## 🙏 Credits

- Design inspiration from various recipe blogs
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Comments powered by [Disqus](https://disqus.com/)