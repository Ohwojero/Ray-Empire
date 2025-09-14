import { type NextRequest, NextResponse } from "next/server"
import { sales } from "@/app/api/sales/route"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // In a real app, you would fetch from your sales database
  // For demo, we'll use the sales data
  const sale = sales.find((s) => s.id === params.id)

  if (!sale) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
  }

  // Add invoice-specific data
  const invoice = {
    ...sale,
    invoiceNumber: `INV-${params.id.slice(-6).toUpperCase  ()}`,
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
