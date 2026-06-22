/**
 * MonthlyBarChart — переиспользуемый тонкий враппер над recharts BarChart.
 * Суммы в данных передаются в наименьших единицах валюты (хранятся как int64 на бекенде).
 */

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatMoney } from '@/shared/utils/money'
import './MonthlyBarChart.css'

const NARROW_BREAKPOINT = 640
function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(`(max-width: ${NARROW_BREAKPOINT}px)`).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT}px)`)
    const update = () => setNarrow(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])
  return narrow
}

export interface BarConfig {
  dataKey: string
  label: string
  color: string
}

// recharts читает поля по dataKey динамически, поэтому строгий индекс не нужен
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ChartData = any[]

interface MonthlyBarChartProps {
  data: ChartData
  bars: BarConfig[]
  height?: number
  loading?: boolean
  /** Пояснение: показывается в тултипе */
  explanation?: string
}

const CustomTooltip = ({
  active,
  payload,
  label,
  explanation,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  explanation?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="monthly-bar-chart-tooltip">
      <p className="monthly-bar-chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="monthly-bar-chart-tooltip-row">
          {entry.name}: {formatMoney(entry.value)}
        </p>
      ))}
      {explanation && (
        <p className="monthly-bar-chart-tooltip-explanation">{explanation}</p>
      )}
    </div>
  )
}

const formatYAxis = (value: number): string => {
  const money = value / 100
  if (Math.abs(money) >= 1_000_000) return `${(money / 1_000_000).toFixed(1)} млн`
  if (Math.abs(money) >= 1_000) return `${Math.round(money / 1_000)}к`
  return String(Math.round(money))
}

export const MonthlyBarChart = ({
  data,
  bars,
  height = 240,
  loading = false,
  explanation,
}: MonthlyBarChartProps) => {
  const isNarrow = useIsNarrow()

  if (loading) {
    return <div className="monthly-bar-chart-skeleton" style={{ height }} />
  }

  if (!data.length) {
    return (
      <div className="monthly-bar-chart-empty" style={{ height }}>
        Нет данных за выбранный период
      </div>
    )
  }

  const margin = isNarrow
    ? { top: 8, right: 4, left: 0, bottom: 40 }
    : { top: 8, right: 8, left: 0, bottom: 32 }
  const xTickFontSize = isNarrow ? 10 : 12
  const yTickFontSize = isNarrow ? 10 : 11
  const yAxisWidth = isNarrow ? 40 : 56
  const legendStyle = isNarrow ? { fontSize: 10, paddingTop: 6 } : { fontSize: 12, paddingTop: 8 }

  return (
    <div className="monthly-bar-chart">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
        <XAxis
          dataKey="month"
          type="category"
          interval={isNarrow ? 1 : 0}
          tick={{ fontSize: xTickFontSize, fill: 'var(--color-chart-axis)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatYAxis}
          tick={{ fontSize: yTickFontSize, fill: 'var(--color-chart-axis)' }}
          axisLine={false}
          tickLine={false}
          width={yAxisWidth}
        />
        <Tooltip
          content={<CustomTooltip explanation={explanation} />}
          cursor={{ fill: 'var(--color-chart-cursor)' }}
        />
        <Legend
          wrapperStyle={legendStyle}
          formatter={(value) => <span style={{ color: 'var(--color-chart-axis)' }}>{value}</span>}
        />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.label}
            fill={bar.color}
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
        ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
