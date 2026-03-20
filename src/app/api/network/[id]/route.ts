import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params
  try {
    const device = await prisma.networkDevice.findUnique({
      where: { id },
      include: { rack: { include: { datacenter: true } } }
    })
    if (!device) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: device })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params
  try {
    await prisma.networkDevice.delete({ where: { id } })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
