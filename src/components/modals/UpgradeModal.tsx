'use client'

import { X, Crown, Check } from 'lucide-react'

const PRO_FEATURES = [
  'Unlimited logs & history',
  'Advanced insights & trends',
  'Export to PDF & Notion',
  'Weekly AI summary reports',
  'Priority report generation',
]

export default function UpgradeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#252525]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F4C430]/15 flex items-center justify-center">
              <Crown size={15} className="text-[#F4C430]" />
            </div>
            <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Logify Pro</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-[#555] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <span className="inline-block text-[11px] font-semibold text-[#F4C430] bg-[#F4C430]/10 px-2.5 py-1 rounded-full mb-4">
            Coming soon
          </span>
          <p className="text-[13px] text-gray-500 dark:text-[#888] mb-4 leading-relaxed">
            Pro is in the works. Here&apos;s what&apos;s planned:
          </p>
          <ul className="space-y-2.5">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-[#ccc]">
                <span className="w-4 h-4 rounded-full bg-[#F4C430]/15 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-[#F4C430]" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-[#252525]">
          <button
            onClick={onClose}
            className="w-full bg-[#F4C430] hover:bg-[#e0b420] text-black text-[13px] font-semibold py-2.5 rounded-xl transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
