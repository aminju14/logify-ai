'use client'

interface Activity {
  label: string
  percent: number
}

const PALETTE = ['#7C3AED', '#A78BFA', '#F97316', '#14B8A6', '#F4C430', '#60A5FA']

interface DonutChartProps {
  activities: Activity[]
}

export default function DonutChart({ activities }: DonutChartProps) {
  const R = 36
  const CX = 50
  const CY = 50
  const C = 2 * Math.PI * R
  const GAP = 2

  let cumulative = 0
  const segs = activities.map((a, i) => {
    const dash = (a.percent / 100) * (C - GAP * activities.length)
    const offset = C - (cumulative / 100) * (C - GAP * activities.length) - (i * GAP)
    cumulative += a.percent
    return { ...a, dash, offset, color: PALETTE[i % PALETTE.length] }
  })

  return (
    <div className="flex items-center gap-5">
      {/* Donut */}
      <div className="shrink-0 w-[100px] h-[100px]">
        <svg viewBox="0 0 100 100" width="100" height="100">
          {/* Track */}
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="currentColor" strokeWidth={14}
            className="text-gray-100 dark:text-[#252525]" />
          {/* Segments */}
          {segs.map((s, i) => (
            <circle
              key={i}
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke={s.color}
              strokeWidth={13}
              strokeDasharray={`${s.dash} ${C - s.dash}`}
              strokeDashoffset={s.offset}
              transform={`rotate(-90 ${CX} ${CY})`}
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2">
        {segs.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
              <span className="text-[12px] text-gray-600 dark:text-[#aaa]">{s.label}</span>
            </div>
            <span className="text-[12px] font-semibold text-gray-800 dark:text-white">{s.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
