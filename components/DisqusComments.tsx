'use client'

import { useEffect } from 'react'

interface DisqusCommentsProps {
  shortname: string // Disqus shortname (나중에 설정)
  identifier: string // 포스트 고유 ID (slug 사용)
  title: string // 포스트 제목
  url: string // 포스트 URL
}

export default function DisqusComments({ shortname, identifier, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    // Disqus 설정
    const disqusConfig = function (this: any) {
      this.page.url = url
      this.page.identifier = identifier
      this.page.title = title
    }

    // Disqus가 이미 로드되어 있으면 reset
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: disqusConfig,
      })
    } else {
      // 처음 로드
      window.disqus_config = disqusConfig
      const script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.setAttribute('data-timestamp', String(+new Date()))
      document.body.appendChild(script)
    }
  }, [shortname, identifier, title, url])

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">댓글</h2>
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  )
}

// TypeScript 타입 선언
declare global {
  interface Window {
    DISQUS?: any
    disqus_config?: any
  }
}
