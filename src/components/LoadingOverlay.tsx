'use client'

const STEPS = ['Understanding your input…', 'Structuring report…', 'Generating insights…']

interface LoadingOverlayProps {
  step: number
}

export default function LoadingOverlay({ step }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-8 w-72 text-center shadow-2xl">
        {/* Spinner */}
        <div className="w-12 h-12 mx-auto mb-5 rounded-full border-2 border-[#F4C430]/20 border-t-[#F4C430] animate-spin" />

        <h3 className="text-[14px] font-semibold text-gray-900 dark:text-white mb-4">
          Generating Report
        </h3>

        <div className="space-y-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2.5">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-[#F4C430]' : 'bg-gray-200 dark:bg-[#333]'
                }`}
              />
              <span
                className={`text-[12px] transition-colors ${
                  i === step
                    ? 'text-gray-900 dark:text-white font-medium'
                    : i < step
                    ? 'text-gray-400 dark:text-[#555]'
                    : 'text-gray-300 dark:text-[#444]'
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
