"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { InvoiceTemplate } from "@/components/invoice/invoice-template"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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

export default function InvoicePage() {
  const params = useParams()
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchInvoice(params.id as string)
    }
  }, [params.id])

  const fetchInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoice/${id}`)
      if (response.ok) {
        const data = await response.json()
        setInvoice(data)
      } else {
        setError("Invoice not found")
      }
    } catch (error) {
      setError("Failed to load invoice")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
            <p className="text-muted-foreground">Loading invoice...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !invoice) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoice</h1>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Invoice not found"}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">View and print invoice details</p>
        </div>

        <InvoiceTemplate invoice={invoice} />
      </div>
    </DashboardLayout>
  )
}
