"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { InventoryItem } from "@/lib/types"
import { Search, Plus } from "lucide-react"

interface ItemSearchProps {
  onAddToCart: (item: InventoryItem, quantity: number) => void
}

export function ItemSearch({ onAddToCart }: ItemSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredItems(filtered.slice(0, 10)) // Limit to 10 results
    } else {
      setFilteredItems([])
    }
  }, [searchTerm, items])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/inventory")
      const data = await response.json()
      setItems(data.filter((item: InventoryItem) => item.stock > 0)) // Only show items in stock
    } catch (error) {
      console.error("Failed to fetch items:", error)
    }
  }

  const handleAddToCart = (item: InventoryItem) => {
    const quantity = quantities[item.id] || 1
    if (quantity > item.stock) {
      alert(`Only ${item.stock} units available in stock`)
      return
    }
    onAddToCart(item, quantity)
    setQuantities({ ...quantities, [item.id]: 1 })
    setSearchTerm("")
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setQuantities({ ...quantities, [itemId]: Math.max(1, quantity) })
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items by name, SKU, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredItems.length > 0 && (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge variant="outline">{item.sku}</Badge>
                      {item.stock <= item.minStock && <Badge variant="destructive">Low Stock</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-medium">${item.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">{item.stock} in stock</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={quantities[item.id] || 1}
                      onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                    <Button onClick={() => handleAddToCart(item)} size="sm">
                      <Plus className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
