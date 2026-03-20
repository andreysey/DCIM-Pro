import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rack = await prisma.rack.create({
      data: { 
        name: body.name, 
        unitsTotal: parseInt(body.unitsTotal) || 42,
        datacenterId: body.datacenterId
      }
    })
    return NextResponse.json({ data: rack })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
