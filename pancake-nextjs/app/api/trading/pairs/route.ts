import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function GET(request: Request) {
  const session = await auth0.getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return NextResponse.json({ error: 'API URL not configured' }, { status: 500 })
  }

  const { accessToken } = await auth0.getAccessToken()
  if (!accessToken) {
    return NextResponse.json({ error: 'Missing access token' }, { status: 401 })
  }

  const url = new URL(`${apiUrl}/trading/pairs`)
  const q = new URL(request.url).searchParams.get('q')
  if (q) url.searchParams.set('q', q)

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch pairs' }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json(data)
}
