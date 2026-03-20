import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    await prisma.datacenter.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const { id } = await params
    const body = await req.json()
    const dc = await prisma.datacenter.update({
      where: { id },
      data: { name: body.name, location: body.location }
    })
    return NextResponse.json({ data: dc })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
