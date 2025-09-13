import type { Sale } from "./types"

// Generate mock sales data for the last 30 days
export const generateMockSalesData = (): Sale[] => {
  const sales: Sale[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Generate 1-8 sales per day
    const salesCount = Math.floor(Math.random() * 8) + 1

    for (let j = 0; j < salesCount; j++) {
      const saleDate = new Date(date)
      saleDate.setHours(Math.floor(Math.random() * 12) + 8) // 8 AM to 8 PM
      saleDate.setMinutes(Math.floor(Math.random() * 60))

      const itemCount = Math.floor(Math.random() * 3) + 1
      const items = []
      let total = 0

      for (let k = 0; k < itemCount; k++) {
        const price = Math.random() * 100 + 10 // $10-$110
        const quantity = Math.floor(Math.random() * 3) + 1
        const itemTotal = price * quantity

        items.push({
          id: `item-${i}-${j}-${k}`,
          itemId: `inv-${Math.floor(Math.random() * 100)}`,
          name: `Product ${Math.floor(Math.random() * 50) + 1}`,
          price: Number(price.toFixed(2)),
          quantity,
          total: Number(itemTotal.toFixed(2)),
        })

        total += itemTotal
      }

      sales.push({
        id: `sale-${i}-${j}`,
        items,
        total: Number(total.toFixed(2)),
        customerName: Math.random() > 0.5 ? `Customer ${Math.floor(Math.random() * 100)}` : undefined,
        createdAt: saleDate.toISOString(),
      })
    }
  }

  return sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const mockSalesData = generateMockSalesData()
