import { type NextRequest, NextResponse } from "next/server"
import type { Sale } from "@/lib/types"

// In-memory storage for demo purposes
const sales: Sale[] = []

export async function GET() {
  return NextResponse.json(sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newSale: Sale = {
      id: Date.now().toString(),
      items: data.items,
      total: data.total,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      createdAt: new Date().toISOString(),
    }

    sales.push(newSale)

    // In a real app, you would also update inventory stock levels here
    // For now, we'll just simulate the sale creation

    return NextResponse.json(newSale, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create sale" }, { status: 500 })
  }
}
