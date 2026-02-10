'use client'

import { useRouter } from 'next/navigation'

export default function AdminHeader() {
  const router = useRouter()

  const handleLogout = async () => {
    if (confirm('로그아웃하시겠습니까?')) {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <header className="bg-white border-b shadow-sm mb-6">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
        >
          로그아웃
        </button>
      </div>
    </header>
  )
}
