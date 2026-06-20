'use client'

import { useState } from 'react'
import { X, User } from 'lucide-react'

interface EditProfileModalProps {
  initialName: string
  email: string | null
  onClose: () => void
  onSave: (name: string) => Promise<void> | void
}

export default function EditProfileModal({ initialName, email, onClose, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    try {
      await onSave(name.trim())
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#252525]">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 dark:text-[#555] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-2 block">
              Display name
            </label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2.5">
              <User size={15} className="text-gray-300 dark:text-[#555] shrink-0" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                placeholder="Your name"
                autoFocus
                className="flex-1 bg-transparent text-[13px] text-gray-800 dark:text-[#ccc] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-300 dark:text-[#444] mt-1.5">
              Shown in your dashboard greeting.
            </p>
          </div>

          {email && (
            <div>
              <label className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-2 block">
                Email
              </label>
              <p className="text-[13px] text-gray-500 dark:text-[#777] bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2.5">
                {email}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 dark:border-[#252525]">
          <button
            onClick={onClose}
            className="flex-1 text-[12px] font-medium py-2.5 rounded-xl border border-gray-100 dark:border-[#333] text-gray-600 dark:text-[#ccc] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#F4C430] hover:bg-[#e0b420] disabled:opacity-60 text-black text-[12px] font-semibold py-2.5 rounded-xl transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
