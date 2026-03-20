import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ type: string }>

// Convert body strings to proper integers/floats based on the models
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

export async function GET(req: Request, { params }: { params: Params }) {
  const { type } = await params
  try {
    let data;
    if (type === 'platform') data = await prisma.catalogServerPlatform.findMany({ 
      orderBy: { manufacturer: 'asc' },
      include: { pcieSlots: true, diskSlots: true }
    })
    else if (type === 'processor') data = await prisma.catalogProcessor.findMany({ orderBy: { manufacturer: 'asc' } })
    else if (type === 'ram') data = await prisma.catalogRam.findMany({ orderBy: { capacityGb: 'asc' } })
    else if (type === 'disk') data = await prisma.catalogDisk.findMany({ orderBy: { capacityGb: 'asc' } })
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Params }) {
  const { type } = await params
  try {
    const rawBody = await req.json()
    const body = parseBody(type, rawBody)
    
    let data;
    if (type === 'platform') {
      const { pcieSlotsConfig, diskSlotsConfig, ...rest } = body
      data = await prisma.catalogServerPlatform.create({
        data: {
          ...rest,
          pcieSlots: pcieSlotsConfig ? {
            create: pcieSlotsConfig.map((s: any) => ({
              version: s.version,
              width: s.width,
              heightProfile: s.heightProfile,
              lengthProfile: s.lengthProfile
            }))
          } : undefined,
          diskSlots: diskSlotsConfig ? {
            create: diskSlotsConfig.map((s: any) => ({
              quantity: parseInt(s.quantity),
              interface: s.interface
            }))
          } : undefined
        }
      })
    }
    else if (type === 'processor') data = await prisma.catalogProcessor.create({ data: body })
    else if (type === 'ram') data = await prisma.catalogRam.create({ data: body })
    else if (type === 'disk') data = await prisma.catalogDisk.create({ data: body })
    else return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    
    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 400 })
  }
}
