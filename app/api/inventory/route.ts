import { type NextRequest, NextResponse } from "next/server"
import { mockInventoryItems } from "@/lib/mock-data"
import type { InventoryItem } from "@/lib/types"

// In-memory storage for demo purposes
const items = [...mockInventoryItems]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")
  const category = searchParams.get("category")

  let filteredItems = items

  if (search) {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  if (category && category !== "all") {
    filteredItems = filteredItems.filter((item) => item.category.toLowerCase() === category.toLowerCase())
  }

  return NextResponse.json(filteredItems)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    items.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
