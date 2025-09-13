import { type NextRequest, NextResponse } from "next/server"
import { mockSalesData } from "@/lib/mock-sales-data"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "daily"

  const now = new Date()
  const sales = mockSalesData

  let filteredSales = sales
  const groupedData: Record<string, { sales: number; revenue: number }> = {}

  switch (period) {
    case "daily":
      // Last 7 days
      const sevenDaysAgo = new Date(now)
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filteredSales = sales.filter((sale) => new Date(sale.createdAt) >= sevenDaysAgo)

      // Group by day
      filteredSales.forEach((sale) => {
        const date = new Date(sale.createdAt).toLocaleDateString()
        if (!groupedData[date]) {
          groupedData[date] = { sales: 0, revenue: 0 }
        }
        groupedData[date].sales += 1
        groupedData[date].revenue += sale.total
      })
      break

    case "weekly":
      // Last 8 weeks
      const eightWeeksAgo = new Date(now)
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56)
      filteredSales = sales.filter((sale) => new Date(sale.createdAt) >= eightWeeksAgo)

      // Group by week
      filteredSales.forEach((sale) => {
        const date = new Date(sale.createdAt)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        const weekKey = weekStart.toLocaleDateString()

        if (!groupedData[weekKey]) {
          groupedData[weekKey] = { sales: 0, revenue: 0 }
        }
        groupedData[weekKey].sales += 1
        groupedData[weekKey].revenue += sale.total
      })
      break

    case "monthly":
      // Last 12 months
      const twelveMonthsAgo = new Date(now)
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
      filteredSales = sales.filter((sale) => new Date(sale.createdAt) >= twelveMonthsAgo)

      // Group by month
      filteredSales.forEach((sale) => {
        const date = new Date(sale.createdAt)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        if (!groupedData[monthKey]) {
          groupedData[monthKey] = { sales: 0, revenue: 0 }
        }
        groupedData[monthKey].sales += 1
        groupedData[monthKey].revenue += sale.total
      })
      break

    case "yearly":
      // Last 3 years
      const threeYearsAgo = new Date(now)
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3)
      filteredSales = sales.filter((sale) => new Date(sale.createdAt) >= threeYearsAgo)

      // Group by year
      filteredSales.forEach((sale) => {
        const year = new Date(sale.createdAt).getFullYear().toString()

        if (!groupedData[year]) {
          groupedData[year] = { sales: 0, revenue: 0 }
        }
        groupedData[year].sales += 1
        groupedData[year].revenue += sale.total
      })
      break
  }

  // Convert to array format for charts
  const chartData = Object.entries(groupedData)
    .map(([period, data]) => ({
      period,
      sales: data.sales,
      revenue: Number(data.revenue.toFixed(2)),
    }))
    .sort((a, b) => a.period.localeCompare(b.period))

  // Calculate summary stats
  const totalSales = filteredSales.length
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0

  return NextResponse.json({
    chartData,
    summary: {
      totalSales,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
    },
  })
}
