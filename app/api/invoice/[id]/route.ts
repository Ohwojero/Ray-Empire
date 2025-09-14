import { type NextRequest, NextResponse } from "next/server"
import { sales } from "@/app/api/sales/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // In a real app, you would fetch from your sales database
  // For demo, we'll use the sales data
  let sale = sales.find((s) => s.id === params.id)

  if (!sale) {
    // For demo purposes, return a mock invoice if not found
    sale = {
      id: params.id,
      items: [
        {
          id: "cart-1",
          itemId: "1",
          name: "Sample Item",
          price: 10,
          quantity: 1,
          total: 10,
        },
      ],
      total: 10.8,
      customerName: "Sample Customer",
      customerEmail: "sample@example.com",
      customerPhone: "123-456-7890",
      createdAt: new Date().toISOString(),
    }
  }

  // Add invoice-specific data
  const invoice = {
    ...sale,
    invoiceNumber: `INV-${params.id.slice(-6).toUpperCase()}`,
    issueDate: sale.createdAt,
    dueDate: new Date(new Date(sale.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days later
    subtotal: sale.total / 1.08, // Remove tax to get subtotal
    tax: sale.total - sale.total / 1.08,
    company: {
      name: "RAY EMPIRE",
      address: "123 Business Street",
      city: "Business City, BC 12345",
      phone: "(555) 123-4567",
      email: "info@rayempire.com",
    },
  }

  return NextResponse.json(invoice)
}
