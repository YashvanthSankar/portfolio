import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone()
  const hostname = req.headers.get('host')

  const mainDomain = process.env.MAIN_DOMAIN || 'yashvanth.com'
  const workSubdomain = process.env.WORK_SUBDOMAIN || 'work.yashvanth.com'

  // 1. FORCE REDIRECT: maindomain.com/work -> work.subdomain
  // This catches the path specifically on the main domain
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    if (url.pathname === '/work') {
      return NextResponse.redirect(new URL(`https://${workSubdomain}`, req.url), 301)
    }
  }

  // 2. INTERNAL REWRITE: work.subdomain -> show content from /work folder
  if (hostname === workSubdomain) {
    // Prevent infinite loops: only rewrite root path to /work
    if (url.pathname === '/') {
      url.pathname = '/work'
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

// 3. Matcher ensures the middleware runs on these specific paths
export const config = {
  matcher: ['/work', '/'],
}