import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  
  try {
    const data = await prisma.catalogAttribute.findMany({
      where: type ? { type } : undefined,
      orderBy: [ { type: 'asc' }, { value: 'asc' } ]
    })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await prisma.catalogAttribute.create({
      data: { type: body.type, value: body.value }
    })
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
