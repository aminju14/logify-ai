'use client'

import { useState } from 'react'
import { X, Copy, Save, RefreshCw, Check } from 'lucide-react'
import type { GeneratedReport } from '@/types'

interface ReportModalProps {
  report: GeneratedReport
  onClose: () => void
  onSave: () => void
  onRegenerate: () => void
  loading: boolean
}

export default function ReportModal({ report, onClose, onSave, onRegenerate, loading }: ReportModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = [
      '# Daily Report',
      '',
      '## Summary',
      report.summary,
      '',
      '## Key Accomplishments',
      ...report.accomplishments.map(a => `• ${a}`),
      '',
      '## Challenges',
      ...report.challenges.map(c => `• ${c}`),
      '',
      '## Next Steps',
      ...report.nextSteps.map(n => `• ${n}`),
    ].join('\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#252525]">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Daily Report</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-[#555] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-5">
          <Section title="Summary">
            <p className="text-[13px] text-gray-700 dark:text-[#bbb] leading-relaxed">{report.summary}</p>
          </Section>

          <Section title="Key Accomplishments">
            <ul className="space-y-1.5">
              {report.accomplishments.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-[#bbb]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F4C430] shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Challenges">
            <ul className="space-y-1.5">
              {report.challenges.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-[#bbb]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Next Steps">
            <ul className="space-y-1.5">
              {report.nextSteps.map((n, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-700 dark:text-[#bbb]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  {n}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 dark:border-[#252525]">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#2e2e2e] text-gray-700 dark:text-[#ccc] text-[12px] font-medium py-2.5 rounded-xl transition-colors border border-gray-100 dark:border-[#333]"
          >
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={onSave}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#2e2e2e] text-gray-700 dark:text-[#ccc] text-[12px] font-medium py-2.5 rounded-xl transition-colors border border-gray-100 dark:border-[#333]"
          >
            <Save size={13} />
            Save
          </button>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F4C430] hover:bg-[#e0b420] disabled:opacity-60 text-black text-[12px] font-semibold py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[12px] font-bold text-gray-400 dark:text-[#555] uppercase tracking-wider mb-2">
        {title}
      </h3>
      {children}
    </div>
  )
}
