'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Search, SlidersHorizontal, Plus, CalendarDays, ChevronDown, MoreVertical,
  ChevronRight, LayoutList, TrendingUp, Star, Sparkles, FileDown, Zap,
} from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import { repository } from '@/lib/repository'
import { tagConfig as tcfg } from '@/lib/tags'
import { exportLogsToPdf } from '@/lib/export'
import type { WorkLog } from '@/types'

/* ── Date helpers ── */
function sameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}
function groupByDate(logs: WorkLog[]) {
  const map = new Map<string, { date: Date; items: WorkLog[] }>()
  for (const l of logs) {
    const d = new Date(l.date)
    const k = d.toDateString()
    if (!map.has(k)) map.set(k, { date: d, items: [] })
    map.get(k)!.items.push(l)
  }
  return [...map.values()]
}
function dateLabel(d: Date) {
  const now = new Date()
  if (sameDay(d, now)) return `Today - ${d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

/* ── Trend chart ── */
function TrendChart({ data }: { data: { label: string; value: number }[] }) {
  const W = 560, H = 210, PL = 38, PR = 15, PT = 15, PB = 32
  const CW = W - PL - PR, CH = H - PT - PB
  const maxV = Math.max(...data.map(d => d.value), 20)
  const xs = (i: number) => PL + (i / (data.length - 1)) * CW
  const ys = (v: number) => PT + CH - (v / maxV) * CH
  const pts = data.map((d, i) => ({ x: xs(i), y: ys(d.value) }))
  let line = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2
    line += ` C ${cx} ${pts[i - 1].y} ${cx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  const area = `${line} L ${pts[pts.length - 1].x} ${PT + CH} L ${PL} ${PT + CH} Z`
  const yTicks = [0, 5, 10, 15, 20].filter(v => v <= maxV)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 210 }}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4C430" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F4C430" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PL} y1={ys(v)} x2={W - PR} y2={ys(v)} stroke="#2a2a2a" strokeWidth="1" />
          <text x={PL - 6} y={ys(v) + 4} textAnchor="end" fontSize="9" fill="#555">{v}</text>
        </g>
      ))}
      <path d={area} fill="url(#trendFill)" />
      <path d={line} fill="none" stroke="#F4C430" strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="#F4C430" fillOpacity="0.15" />
          <circle cx={p.x} cy={p.y} r="4" fill="#F4C430" stroke="#111111" strokeWidth="1.5" />
        </g>
      ))}
      {data.map((d, i) => (
        <text key={i} x={xs(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#555">{d.label}</text>
      ))}
    </svg>
  )
}

/* ── Period filter ── */
type Period = 'today' | 'week' | 'month' | 'year'

export default function MyLogsPage() {
  const [allLogs, setAllLogs] = useState<WorkLog[]>([])
  const [period, setPeriod] = useState<Period>('today')
  const [query, setQuery] = useState('')
  const [sortNewest, setSortNewest] = useState(true)

  useEffect(() => { repository.getLogs().then(setAllLogs) }, [])

  const filtered = useMemo(() => {
    const now = new Date()
    const startOf = (n: number) => { const d = new Date(now); d.setDate(now.getDate() - n); d.setHours(0,0,0,0); return d }
    let logs = allLogs
    if (query) { const q = query.toLowerCase(); logs = logs.filter(l => l.title.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q)) }
    logs = logs.filter(l => {
      const d = new Date(l.date)
      if (period === 'today') return sameDay(d, now)
      if (period === 'week') return d >= startOf(7)
      if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      return d.getFullYear() === now.getFullYear()
    })
    return sortNewest ? [...logs].sort((a, b) => +new Date(b.date) - +new Date(a.date)) : logs
  }, [allLogs, period, query, sortNewest])

  const stats = useMemo(() => {
    const cnts: Record<string, number> = {}
    filtered.forEach(l => { cnts[l.tag] = (cnts[l.tag] ?? 0) + 1 })
    const [topTag, topCnt] = Object.entries(cnts).sort((a, b) => b[1] - a[1])[0] ?? ['None', 0]
    const activeDays = new Set(filtered.map(l => new Date(l.date).toDateString())).size
    return {
      total: filtered.length,
      activeDays,
      tagCount: Object.keys(cnts).length,
      topTag, topPct: filtered.length ? Math.round((topCnt / filtered.length) * 100) : 0,
    }
  }, [filtered])

  const trendData = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); d.setHours(0, 0, 0, 0)
    const nd = new Date(d); nd.setDate(d.getDate() + 1)
    const cnt = allLogs.filter(l => { const ld = new Date(l.date); return ld >= d && ld < nd }).length
    return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: cnt }
  }), [allLogs])

  const topTags = useMemo(() => {
    const c: Record<string, number> = {}
    allLogs.forEach(l => { c[l.tag] = (c[l.tag] ?? 0) + 1 })
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [allLogs])

  // Real insight derived from logs: which weekday you log on most.
  const insight = useMemo(() => {
    if (allLogs.length === 0) return null
    const byDay: Record<string, number> = {}
    allLogs.forEach(l => {
      const day = new Date(l.date).toLocaleDateString('en-US', { weekday: 'long' })
      byDay[day] = (byDay[day] ?? 0) + 1
    })
    const [day, count] = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0]
    return { day, count }
  }, [allLogs])

  const groups = groupByDate(filtered)

  return (
    <AppShell search={{ value: query, onChange: setQuery, placeholder: 'Search logs...' }}>
      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto px-6 py-6 min-w-0">

        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Logs</h1>
            <p className="text-[13px] text-gray-400 dark:text-[#666] mt-0.5">Your activity logs and AI-generated reports.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2 w-44">
              <Search size={13} className="text-gray-300 dark:text-[#444] shrink-0" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search logs..."
                className="flex-1 bg-transparent text-[12px] text-gray-600 dark:text-[#888] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] rounded-xl text-[12px] text-gray-500 dark:text-[#666] hover:border-gray-200 dark:hover:border-[#333] transition-colors">
              <SlidersHorizontal size={13} /> Filter
            </button>
            <Link href="/" className="flex items-center gap-1.5 px-4 py-2 bg-[#F4C430] hover:bg-[#e0b420] text-black text-[12px] font-bold rounded-xl transition-colors">
              <Plus size={14} /> New Log
            </Link>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex items-center gap-2 mb-5">
          {(['today','week','month','year'] as const).map((p, i) => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                period === p ? 'bg-[#F4C430] text-black' : 'bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] text-gray-500 dark:text-[#666] hover:border-gray-200 dark:hover:border-[#333]'
              }`}>
              {['Today','This Week','This Month','This Year'][i]}
            </button>
          ))}
          <button className="p-1.5 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-[#252525] text-gray-400 dark:text-[#555] hover:border-gray-200 dark:hover:border-[#333] transition-colors">
            <CalendarDays size={14} />
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Logs', val: stats.total, sub: 'in selected period', icon: LayoutList, ibg: 'bg-purple-500/10', ic: 'text-purple-400', subColor: 'text-gray-400 dark:text-[#555]' },
            { label: 'Active Days', val: stats.activeDays, sub: 'days with a log', icon: CalendarDays, ibg: 'bg-blue-500/10', ic: 'text-blue-400', subColor: 'text-gray-400 dark:text-[#555]' },
            { label: 'Top Activity', val: stats.topTag, sub: stats.total ? `${stats.topPct}% of logs` : 'no logs yet', icon: TrendingUp, ibg: 'bg-emerald-500/10', ic: 'text-emerald-400', subColor: 'text-gray-400 dark:text-[#555]' },
            { label: 'Tags Used', val: stats.tagCount, sub: 'distinct categories', icon: Star, ibg: 'bg-[#F4C430]/10', ic: 'text-[#F4C430]', subColor: 'text-gray-400 dark:text-[#555]' },
          ].map(({ label, val, sub, icon: Icon, ibg, ic, subColor }) => (
            <div key={label} className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] text-gray-400 dark:text-[#555]">{label}</p>
                <div className={`w-8 h-8 rounded-xl ${ibg} flex items-center justify-center shrink-0`}>
                  <Icon size={14} className={ic} />
                </div>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{val}</p>
              <p className={`text-[11px] mt-1 ${subColor}`}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Activity Trend */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white">Activity Trend</h3>
              <p className="text-[11px] text-gray-400 dark:text-[#555] mt-0.5">Your logs over the last 7 days.</p>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] text-gray-500 dark:text-[#666] bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-[#333] rounded-xl px-3 py-1.5">
              7 Days <ChevronDown size={12} />
            </button>
          </div>
          <TrendChart data={trendData} />
        </div>

        {/* Logs List */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white">Logs List</h3>
            <button onClick={() => setSortNewest(n => !n)} className="flex items-center gap-1 text-[12px] text-gray-400 dark:text-[#555]">
              Sort by: <span className="text-gray-700 dark:text-[#aaa] font-medium ml-1">{sortNewest ? 'Newest' : 'Oldest'}</span>
              <ChevronDown size={12} className="ml-0.5" />
            </button>
          </div>

          {groups.length === 0 ? (
            <p className="text-[13px] text-center text-gray-400 dark:text-[#555] py-10">No logs found for this period.</p>
          ) : groups.map(({ date, items }) => (
            <div key={date.toISOString()} className="mb-5 last:mb-0">
              {/* Date header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#F4C430] shrink-0" />
                <span className="text-[12px] font-semibold text-gray-500 dark:text-[#555]">{dateLabel(date)}</span>
              </div>
              {/* Timeline */}
              <div className="relative pl-4 ml-1 border-l-2 border-gray-100 dark:border-[#252525] space-y-2.5">
                {items.map(log => {
                  const c = tcfg(log.tag)
                  const Icon = c.Icon
                  return (
                    <div key={log.id} className="relative">
                      <div className={`absolute -left-[21px] top-3.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#1a1a1a] ${c.dot}`} />
                      <div className="flex items-start gap-3 bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-4 py-3 hover:border-gray-200 dark:hover:border-[#333] transition-all group cursor-pointer">
                        <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon size={14} className={c.iconColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-gray-900 dark:text-white">{log.title}</span>
                            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${c.badge}`}>{log.tag}</span>
                          </div>
                          {log.input && <p className="text-[12px] text-gray-400 dark:text-[#555] mt-0.5 truncate">{log.input}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[12px] text-gray-400 dark:text-[#555]">{log.time}</span>
                          <ChevronRight size={13} className="text-gray-300 dark:text-[#444] group-hover:text-gray-500 dark:group-hover:text-[#666] transition-colors" />
                          <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-300 dark:text-[#444] transition-colors">
                            <MoreVertical size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {filtered.length > 3 && (
            <button className="w-full flex items-center justify-center gap-1.5 mt-3 py-2.5 text-[12px] text-gray-400 dark:text-[#555] hover:text-gray-600 dark:hover:text-[#888] transition-colors">
              View more logs <ChevronDown size={13} />
            </button>
          )}
        </div>
      </main>

      {/* ── Right panel ── */}
      <aside className="w-[280px] shrink-0 overflow-y-auto px-4 py-6 border-l border-gray-100 dark:border-[#1e1e1e] space-y-4">

        {/* AI Insight */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white">AI Insight</h3>
            <Sparkles size={13} className="text-[#F4C430]" />
          </div>
          <p className="text-[11px] text-gray-400 dark:text-[#555] mb-3">Based on your logged activity.</p>
          <div className="flex items-start gap-3 bg-gray-50 dark:bg-[#141414] rounded-xl p-3">
            <div className="w-8 h-8 rounded-xl bg-[#F4C430]/10 flex items-center justify-center shrink-0">
              <Zap size={13} className="text-[#F4C430]" />
            </div>
            <div>
              <p className="text-[12px] text-gray-700 dark:text-[#ccc] leading-relaxed">
                {insight
                  ? `You log most often on ${insight.day} (${insight.count} ${insight.count === 1 ? 'log' : 'logs'}).`
                  : 'Log your work to start seeing patterns here.'}
              </p>
              {insight && <p className="text-[11px] text-[#F4C430] font-semibold mt-1.5">Keep it up!</p>}
            </div>
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-0.5">Top Tags</h3>
          <p className="text-[11px] text-gray-400 dark:text-[#555] mb-3">Filter your logs by tags.</p>
          <div className="space-y-2.5">
            {(topTags.length > 0 ? topTags : [['Development',6],['Meeting',3],['Bug Fix',2],['Research',1]] as [string,number][])
              .map(([tag, cnt]) => {
                const c = tcfg(tag)
                return (
                  <div key={tag} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="text-[12px] text-gray-700 dark:text-[#ccc]">{tag}</span>
                    </div>
                    <span className="text-[12px] font-bold text-gray-500 dark:text-[#666]">{cnt}</span>
                  </div>
                )
              })}
          </div>
          <button className="w-full mt-3 py-2 text-[12px] text-gray-500 dark:text-[#666] bg-gray-50 dark:bg-[#252525] rounded-xl hover:bg-gray-100 dark:hover:bg-[#2e2e2e] border border-gray-100 dark:border-[#333] transition-colors">
            View all tags
          </button>
        </div>

        {/* Export Logs */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-4 shadow-sm dark:shadow-none">
          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white mb-0.5">Export Logs</h3>
          <p className="text-[11px] text-gray-400 dark:text-[#555] mb-3">Download your logs and reports.</p>
          <button
            onClick={() => exportLogsToPdf(filtered)}
            disabled={filtered.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[12px] text-gray-600 dark:text-[#ccc] font-medium bg-gray-50 dark:bg-[#252525] rounded-xl hover:bg-gray-100 dark:hover:bg-[#2e2e2e] border border-gray-100 dark:border-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileDown size={13} /> Export as PDF
          </button>
        </div>

        {/* Generate Weekly Report */}
        <div className="bg-[#F4C430] rounded-2xl p-4 cursor-pointer hover:bg-[#e0b420] transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-black" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-black">Generate Weekly Report</p>
              <p className="text-[11px] text-black/60 mt-0.5">Summarize your week in one click.</p>
            </div>
          </div>
        </div>

      </aside>
    </AppShell>
  )
}
