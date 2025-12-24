import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get('host')

  // 1. Redirect yashvanth.com/work -> work.yashvanth.com
  if (hostname === 'yashvanth.com' && url.pathname === '/work') {
    return NextResponse.redirect(new URL('https://work.yashvanth.com', req.url), 301)
  }

  // 2. Rewrite work.yashvanth.com -> internally shows the /work page
  if (hostname === 'work.yashvanth.com') {
    // If they are already at the root of the subdomain, show /work
    if (url.pathname === '/') {
       return NextResponse.rewrite(new URL('/work', req.url))
    }
  }

  return NextResponse.next()
}