'use client'

interface ProgressChartProps {
  /** Daily log counts for the last 7 days, oldest first. */
  data: { label: string; value: number }[]
}

function buildPath(values: number[], w: number, h: number): string {
  const max = Math.max(...values, 1)
  const xs = values.map((_, i) => (i / Math.max(values.length - 1, 1)) * w)
  // Invert: higher count → higher on the chart (smaller y).
  const ys = values.map((v) => h - (v / max) * h)

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < values.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const W = 240
  const H = 70
  // Guard against an empty initial render before logs load.
  const points = data.length > 0 ? data : Array.from({ length: 7 }, () => ({ label: '', value: 0 }))
  const values = points.map((d) => d.value)
  const total = values.reduce((a, b) => a + b, 0)

  const linePath = buildPath(values, W, H)
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
      <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-1">
        Last 7 Days
      </h3>

      <div className="mb-3">
        <span className="text-3xl font-bold text-[#F4C430]">{total}</span>
        <p className="text-[11px] text-gray-400 dark:text-[#555] mt-0.5">
          {total === 1 ? 'log this week' : 'logs this week'}
        </p>
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 72 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4C430" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F4C430" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={linePath} fill="none" stroke="#F4C430" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        {points.map((d, i) => (
          <span key={i} className="text-[9px] text-gray-300 dark:text-[#444]">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
