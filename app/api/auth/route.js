import { NextResponse } from 'next/server'

export async function POST(request) {
  const { pin } = await request.json()
  const correctPin = process.env.ADMIN_PIN || '786000'
  
  if (pin === correctPin) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: false }, { status: 401 })
}
