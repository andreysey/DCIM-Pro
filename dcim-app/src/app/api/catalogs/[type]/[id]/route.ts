import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ type: string, id: string }>

const parseBody = (type: string, body: any) => {
  const result = { ...body }
  if (type === 'platform') {
    if (result.ramSlots) result.ramSlots = parseInt(result.ramSlots)
    if (result.heightU) result.heightU = parseInt(result.heightU)
    if (result.socketNum !== undefined && result.socketNum !== '') result.socketNum = parseInt(result.socketNum)
    else delete result.socketNum;
  } else if (type === 'processor') {
    if (result.cores) result.cores = parseInt(result.cores)
    if (result.frequencyGhz) result.frequencyGhz = parseFloat(result.frequencyGhz)
  } else if (type === 'ram' || type === 'disk') {
    if (result.capacityGb) result.capacityGb = parseInt(result.capacityGb)
  }
  return result
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { type, id } = await params
  try {
    if (type === 'platform') await prisma.catalogServerPlatform.delete({ where: { id } })
    else if (type === 'processor') await prisma.catalogProcessor.delete({ where: { id } })
    else if (type === 'ram') await prisma.catalogRam.delete({ where: { id } })
    else if (type === 'disk') await prisma.catalogDisk.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  const { type, id } = await params
  try {
    const rawBody = await req.json()
    const body = parseBody(type, rawBody)

    let data;
    if (type === 'platform') {
      const { pcieSlotsConfig, diskSlotsConfig, ...rest } = body
      data = await prisma.catalogServerPlatform.update({
        where: { id },
        data: {
          ...rest,
          pcieSlots: {
            deleteMany: {},
            create: pcieSlotsConfig ? pcieSlotsConfig.map((s: any) => ({
              version: s.version,
              width: s.width,
              heightProfile: s.heightProfile,
              lengthProfile: s.lengthProfile
            })) : []
          },
          diskSlots: {
            deleteMany: {},
            create: diskSlotsConfig ? diskSlotsConfig.map((s: any) => ({
              quantity: parseInt(s.quantity),
              interface: s.interface
            })) : []
          }
        }
      })
    }
    else if (type === 'processor') data = await prisma.catalogProcessor.update({ where: { id }, data: body })
    else if (type === 'ram') data = await prisma.catalogRam.update({ where: { id }, data: body })
    else if (type === 'disk') data = await prisma.catalogDisk.update({ where: { id }, data: body })
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

    return NextResponse.json({ data }, { status: 200 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Item with this Manufacturer and Model already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 })
  }
}
