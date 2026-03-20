import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const datacenters = await prisma.datacenter.findMany({
      include: { racks: { include: { _count: { select: { servers: true } } } } },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json({ data: datacenters })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const dc = await prisma.datacenter.create({
      data: { name: body.name, location: body.location }
    })
    return NextResponse.json({ data: dc })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
