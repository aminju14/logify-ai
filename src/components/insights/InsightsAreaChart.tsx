'use client'

const LABELS = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu']
const DATA = [0.5, 0.65, 0.45, 0.7, 0.55, 0.35, 0.2]

function buildPath(data: number[], w: number, h: number) {
  const xs = data.map((_, i) => (i / (data.length - 1)) * w)
  const ys = data.map(v => v * h)
  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < data.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

export default function InsightsAreaChart() {
  const W = 400
  const H = 80
  const line = buildPath(DATA, W, H)
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
        {LABELS.map(l => (
          <span key={l} className="text-[10px] text-gray-300 dark:text-[#444]">{l}</span>
        ))}
      </div>
    </div>
  )
}
