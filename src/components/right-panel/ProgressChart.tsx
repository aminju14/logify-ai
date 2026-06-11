'use client'

const LABELS = ['7AM', '9AM', '11AM', '1PM', '3PM', '5PM', '7PM']
// Normalized y values (0=top, 1=bottom within chart area)
const DATA = [0.55, 0.72, 0.35, 0.6, 0.78, 0.42, 0.2]

function buildPath(data: number[], w: number, h: number): string {
  const xs = data.map((_, i) => (i / (data.length - 1)) * w)
  const ys = data.map(v => v * h)

  let d = `M ${xs[0]} ${ys[0]}`
  for (let i = 1; i < data.length; i++) {
    const cpx = (xs[i - 1] + xs[i]) / 2
    d += ` C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${xs[i]} ${ys[i]}`
  }
  return d
}

export default function ProgressChart() {
  const W = 240
  const H = 70

  const linePath = buildPath(DATA, W, H)
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
      <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-1">
        Today&apos;s Progress
      </h3>

      <div className="mb-3">
        <span className="text-3xl font-bold text-[#F4C430]">76%</span>
        <p className="text-[11px] text-gray-400 dark:text-[#555] mt-0.5">Overall Progress</p>
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
        {LABELS.map(l => (
          <span key={l} className="text-[9px] text-gray-300 dark:text-[#444]">
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
