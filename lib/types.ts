export interface InventoryItem {
  id: string
  name: string
  description: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  supplier: string
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: string
  items: SaleItem[]
  total: number
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  createdAt: string
}

export interface SaleItem {
  id: string
  itemId: string
  name: string
  price: number
  quantity: number
  total: number
}
