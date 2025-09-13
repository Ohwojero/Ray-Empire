"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer as Print, Download } from "lucide-react"

interface InvoiceData {
  id: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  company: {
    name: string
    address: string
    city: string
    phone: string
    email: string
  }
}

interface InvoiceTemplateProps {
  invoice: InvoiceData
  showActions?: boolean
}

export function InvoiceTemplate({ invoice, showActions = true }: InvoiceTemplateProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, you would generate a PDF
    // For demo, we'll just trigger print
    window.print()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {showActions && (
        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} variant="outline">
            <Print className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      )}

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">{invoice.company.name}</h1>
              <div className="text-sm text-muted-foreground mt-2">
                <p>{invoice.company.address}</p>
                <p>{invoice.company.city}</p>
                <p>{invoice.company.phone}</p>
                <p>{invoice.company.email}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">INVOICE</h2>
              <div className="text-sm mt-2">
                <p>
                  <span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}
                </p>
                <p>
                  <span className="font-medium">Issue Date:</span> {formatDate(invoice.issueDate)}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
            <div className="text-sm">
              {invoice.customerName ? (
                <>
                  <p className="font-medium">{invoice.customerName}</p>
                  {invoice.customerEmail && <p>{invoice.customerEmail}</p>}
                  {invoice.customerPhone && <p>{invoice.customerPhone}</p>}
                </>
              ) : (
                <p className="text-muted-foreground">Walk-in Customer</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Description</th>
                    <th className="text-right p-3 font-medium">Qty</th>
                    <th className="text-right p-3 font-medium">Price</th>
                    <th className="text-right p-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="p-3">{item.name}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                      <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p className="mt-2">Payment is due within 30 days of invoice date.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
