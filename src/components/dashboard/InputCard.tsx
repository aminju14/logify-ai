'use client'

import { useState } from 'react'
import { PenLine, Plus, Sparkles } from 'lucide-react'
import type { Tag } from '@/types'

const TAGS: Tag[] = [
  { label: 'Meeting', dotColor: 'bg-blue-400' },
  { label: 'Development', dotColor: 'bg-purple-400' },
  { label: 'Bug Fix', dotColor: 'bg-orange-400' },
  { label: 'Research', dotColor: 'bg-teal-400' },
  { label: 'Design', dotColor: 'bg-sky-400' },
]

interface InputCardProps {
  onGenerate: (input: string, tags: string[]) => void
  loading: boolean
}

export default function InputCard({ onGenerate, loading }: InputCardProps) {
  const [input, setInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const MAX = 3000

  const toggleTag = (label: string) => {
    setSelectedTags(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    )
  }

  const handleGenerate = () => {
    if (!input.trim() || loading) return
    onGenerate(input.trim(), selectedTags)
  }

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none">
      {/* Card header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-[#252525] flex items-center justify-center">
          <PenLine size={15} className="text-gray-400 dark:text-[#666]" />
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
          What did you work on today?
        </h2>
      </div>

      {/* Textarea */}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value.slice(0, MAX))}
        placeholder="Write or paste your notes here..."
        rows={5}
        className="w-full bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-4 py-3 text-[13px] text-gray-800 dark:text-[#ccc] placeholder-gray-300 dark:placeholder-[#444] resize-none focus:outline-none focus:ring-1 focus:ring-[#F4C430]/50 transition-all"
      />
      <p className="text-[11px] text-gray-300 dark:text-[#444] mt-1.5 mb-4">
        {input.length}/{MAX}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button className="flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-[#555] hover:text-gray-600 dark:hover:text-[#888] transition-colors">
          <Plus size={13} />
          Add tags
        </button>
        {TAGS.map(({ label, dotColor }) => (
          <button
            key={label}
            onClick={() => toggleTag(label)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
              selectedTags.includes(label)
                ? 'bg-gray-100 dark:bg-[#2a2a2a] border-gray-300 dark:border-[#3a3a3a] text-gray-700 dark:text-white'
                : 'bg-gray-50 dark:bg-[#1e1e1e] border-gray-100 dark:border-[#252525] text-gray-500 dark:text-[#888] hover:border-gray-200 dark:hover:border-[#333]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!input.trim() || loading}
        className="w-full flex items-center justify-center gap-2 bg-[#F4C430] hover:bg-[#e0b420] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-[13px] py-3 rounded-xl transition-all duration-200 shadow-sm"
      >
        <Sparkles size={15} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Generating…' : 'Generate Report'}
      </button>
    </div>
  )
}
