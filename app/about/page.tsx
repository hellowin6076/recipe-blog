import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img src="/favicon.ico" alt="로고" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-gray-900">레시피 블로그</h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium transition">
                홈
              </Link>
              <Link
                href="/about"
                className="text-gray-900 font-bold border-b-2 border-blue-600"
              >
                소개
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">블로그 소개</h1>

          <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
            <p>안녕하세요. 오사카에서 개발자로 일하며 살고 있습니다.</p>

            <p>
              평소 좋아하는 요리를 하면서도 레시피를 자꾸 까먹는 문제가 있었어요. 그래서 레시피를
              정리할 겸, 평소 관심 있던 백엔드 CMS와 프론트엔드 기술을 직접 공부하며 이 블로그를
              만들게 되었습니다.
            </p>

            <p>
              일본 마트에서 쉽게 구할 수 있는 재료들로, 한국인의 입맛에 맞는 집밥을 만들어 먹고
              있습니다. 거창하지 않지만 일상에서 자주 해먹는 소소한 요리들을 기록하고 공유합니다.
            </p>

            <div className="pt-8 mt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">연락</h2>
              <p className="mb-4">레시피에 대한 질문이나 제안이 있으시면 언제든 연락 주세요.</p>
              
                <a href="mailto:hellowin6076@naver.com"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                hellowin6076@naver.com
              </a>
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              레시피 보러 가기
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}