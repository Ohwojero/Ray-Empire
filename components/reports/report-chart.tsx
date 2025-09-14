"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ReportChartProps {
  data: Array<{
    period: string
    sales: number
    revenue: number
  }>
  title: string
  description: string
  type: "line" | "bar"
  dataKey: "sales" | "revenue"
}

export function ReportChart({ data, title, description, type, dataKey }: ReportChartProps) {
  const formatValue = (value: number) => {
    if (dataKey === "revenue") {
      return `$${value.toLocaleString()}`
    }
    return value.toString()
  }

  const formatPeriod = (period: string) => {
    // Try to format dates nicely
    try {
      const date = new Date(period)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: data.length > 10 ? undefined : "numeric",
        })
      }
    } catch {
      // If it's not a date, check if it's year-month
      if (period.includes("-")) {
        const [year, month] = period.split("-")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return `${monthNames[parseInt(month) - 1]} ${year}`
      }
      // If it's just a year
      return period
    }
    return period
  }

  const Chart = type === "line" ? LineChart : BarChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" tickFormatter={formatPeriod} angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={formatValue} />
              <Tooltip
                formatter={(value: number) => [formatValue(value), dataKey === "sales" ? "Sales" : "Revenue"]}
                labelFormatter={(label) => `Period: ${formatPeriod(label)}`}
              />
              {type === "line" ? (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              ) : (
                <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
