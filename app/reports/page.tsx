"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ReportChart } from "@/components/reports/report-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, ShoppingCart } from "lucide-react"

interface ReportData {
  chartData: Array<{
    period: string
    sales: number
    revenue: number
  }>
  summary: {
    totalSales: number
    totalRevenue: number
    averageOrderValue: number
  }
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("daily")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod])

  const fetchReportData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reports?period=${selectedPeriod}`)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Failed to fetch report data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Last 7 Days"
      case "weekly":
        return "Last 8 Weeks"
      case "monthly":
        return "Last 12 Months"
      case "yearly":
        return "Last 3 Years"
      default:
        return "Period"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Loading report data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">Track your sales performance and analyze business trends over time.</p>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily (Last 7 days)</SelectItem>
              <SelectItem value="weekly">Weekly (Last 8 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly (Last 12 months)</SelectItem>
              <SelectItem value="yearly">Yearly (Last 3 years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reportData && (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.summary.totalSales}</div>
                  <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{reportData.summary.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{getPeriodLabel()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{reportData.summary.averageOrderValue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Per transaction</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="sales" className="space-y-4">
              <TabsList>
                <TabsTrigger value="sales">Sales Volume</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ReportChart
                    data={reportData.chartData}
                    title="Sales Trend"
                    description={`Number of sales over ${getPeriodLabel().toLowerCase()}`}
                    type="line"
                    dataKey="sales"
                  />
                  <ReportChart
                    data={reportData.chartData}
                    title="Sales Distribution"
                    description={`Sales volume breakdown by ${selectedPeriod.slice(0, -2)}`}
                    type="bar"
                    dataKey="sales"
                  />
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <div className="grid gap-6 lg:grid-cols-2">
                  <ReportChart
                    data={reportData.chartData}
                    title="Revenue Trend"
                    description={`Revenue performance over ${getPeriodLabel().toLowerCase()}`}
                    type="line"
                    dataKey="revenue"
                  />
                  <ReportChart
                    data={reportData.chartData}
                    title="Revenue Distribution"
                    description={`Revenue breakdown by ${selectedPeriod.slice(0, -2)}`}
                    type="bar"
                    dataKey="revenue"
                  />
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Breakdown</CardTitle>
                    <CardDescription>Detailed {selectedPeriod} performance data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="h-12 px-4 text-left align-middle font-medium">Period</th>
                              <th className="h-12 px-4 text-left align-middle font-medium">Sales</th>
                              <th className="h-12 px-4 text-left align-middle font-medium">Revenue</th>
                              <th className="h-12 px-4 text-left align-middle font-medium">Avg Order</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.chartData
                              .slice(-10)
                              .reverse()
                              .map((row, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-4">{row.period}</td>
                                  <td className="p-4">{row.sales}</td>
                                  <td className="p-4">₦{row.revenue.toLocaleString()}</td>
                                  <td className="p-4">₦{row.sales > 0 ? (row.revenue / row.sales).toFixed(2) : "0.00"}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
