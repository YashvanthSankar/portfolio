import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')

  // 1. FORCE REDIRECT: yashvanth.com/work -> work.yashvanth.com
  // This catches the path specifically on the main domain
  if (hostname === 'yashvanth.com' || hostname === 'www.yashvanth.com') {
    if (url.pathname === '/work') {
      return NextResponse.redirect(new URL('https://work.yashvanth.com', req.url), 301)
    }
  }

  // 2. INTERNAL REWRITE: work.yashvanth.com -> show content from /work folder
  if (hostname === 'work.yashvanth.com') {
    // Prevent infinite loops: if they are already on the subdomain, 
    // we only rewrite if they are at the root
    if (url.pathname === '/') {
      url.pathname = '/work'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

// 3. IMPORTANT: Matcher ensures the middleware runs on these specific paths
export const config = {
  matcher: ['/work', '/'],
}