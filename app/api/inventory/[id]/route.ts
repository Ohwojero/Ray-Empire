import { type NextRequest, NextResponse } from "next/server"
import { mockInventoryItems } from "@/lib/mock-data"

// In-memory storage for demo purposes
const items = [...mockInventoryItems]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const item = items.find((i) => i.id === params.id)

  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const itemIndex = items.findIndex((i) => i.id === params.id)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    items[itemIndex] = {
      ...items[itemIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(items[itemIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const itemIndex = items.findIndex((i) => i.id === params.id)

  if (itemIndex === -1) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }

  items.splice(itemIndex, 1)

  return NextResponse.json({ success: true })
}
