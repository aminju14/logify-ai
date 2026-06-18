'use client'

interface InsightsAreaChartProps {
  /** Daily log counts, oldest first. */
  data: { label: string; value: number }[]
}

function buildPath(values: number[], w: number, h: number) {
  const max = Math.max(...values, 1)
  const xs = values.map((_, i) => (i / Math.max(values.length - 1, 1)) * w)
  const ys = values.map((v) => h - (v / max) * h)
  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < values.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

export default function InsightsAreaChart({ data }: InsightsAreaChartProps) {
  const W = 400
  const H = 80

  // Fallback to a flat baseline if there is no data yet.
  const points = data.length > 0 ? data : Array.from({ length: 7 }, () => ({ label: '', value: 0 }))
  const values = points.map((p) => p.value)
  const line = buildPath(values, W, H)
  const area = `${line} L ${W} ${H} L 0 ${H} Z`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
        <defs>
          <linearGradient id="insightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F4C430" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F4C430" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#insightGrad)" />
        <path d={line} fill="none" stroke="#F4C430" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="flex justify-between mt-1">
        {points.map((p, i) => (
          <span key={i} className="text-[10px] text-gray-300 dark:text-[#444]">{p.label}</span>
        ))}
      </div>
    </div>
  )
}
