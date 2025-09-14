"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ItemSearch } from "@/components/sales/item-search"
import { Cart } from "@/components/sales/cart"
import { InvoiceTemplate } from "@/components/invoice/invoice-template"
import type { InventoryItem, SaleItem } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"

export default function SalesPage() {
  const [cartItems, setCartItems] = useState<SaleItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastSaleId, setLastSaleId] = useState<string | null>(null)
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState<any>(null)
  const router = useRouter()

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error("Failed to parse saved cart:", error)
      }
    }
  }, [])

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: InventoryItem, quantity: number) => {
    const existingItem = cartItems.find((cartItem) => cartItem.itemId === item.id)

    if (existingItem) {
      // Update existing item quantity
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.itemId === item.id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + quantity,
                total: (cartItem.quantity + quantity) * cartItem.price,
              }
            : cartItem,
        ),
      )
    } else {
      // Add new item to cart
      const newCartItem: SaleItem = {
        id: `cart-${Date.now()}-${item.id}`,
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        total: item.price * quantity,
      }
      setCartItems([...cartItems, newCartItem])
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              total: quantity * item.price,
            }
          : item,
      ),
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }

  const handleCheckout = async (customerInfo: { name?: string; email?: string; phone?: string }) => {
    setIsProcessing(true)

    try {
      const total = cartItems.reduce((sum, item) => sum + item.total, 0)
      const tax = total * 0.08
      const finalTotal = total + tax

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          total: finalTotal,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
        }),
      })

      if (response.ok) {
        const sale = await response.json()
        setLastSaleId(sale.id)
        setCartItems([])
        localStorage.removeItem("cartItems")

        // Auto-hide success message after 4 minutes
        setTimeout(() => setLastSaleId(null), 4 * 60 * 1000)
      } else {
        alert("Failed to process sale")
      }
    } catch (error) {
      console.error("Failed to process sale:", error)
      alert("Failed to process sale")
    } finally {
      setIsProcessing(false)
    }
  }

  const viewInvoice = async () => {
    if (lastSaleId) {
      try {
        const response = await fetch(`/api/invoice/${lastSaleId}`)
        if (response.ok) {
          const data = await response.json()
          setInvoiceData(data)
          setIsInvoiceModalOpen(true)
        } else {
          alert("Failed to load invoice")
        }
      } catch (error) {
        console.error("Failed to load invoice:", error)
        alert("Failed to load invoice")
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6 rounded-lg shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">Search for items, add them to cart, and complete sales transactions.</p>
        </div>

        {lastSaleId && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Sale completed successfully! Invoice #{lastSaleId}</span>
              <button onClick={viewInvoice} className="text-primary hover:underline font-medium cursor-pointer">
                View Invoice
              </button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Items</h2>
              <ItemSearch onAddToCart={addToCart} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={handleCheckout}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>

      <Dialog open={isInvoiceModalOpen} onOpenChange={setIsInvoiceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {invoiceData && <InvoiceTemplate invoice={invoiceData} />}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
