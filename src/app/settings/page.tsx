'use client'

import { useState, useEffect } from 'react'
import {
  User, Palette, Globe, Bell, Shield, Crown, ChevronRight,
  Camera, Sparkles, CalendarDays, Mail, Megaphone, Database, BarChart2,
} from 'lucide-react'
import AppShell from '@/components/AppShell'
import { useTheme } from '@/components/ThemeProvider'
import { repository } from '@/lib/repository'
import { DEFAULT_SETTINGS, type Settings } from '@/types'

/* ── Toggle ── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-[#F4C430]' : 'bg-gray-200 dark:bg-[#333]'
        }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
      />
    </button>
  )
}

/* ── Radio ── */
function Radio({ selected, label, onChange }: { selected: boolean; label: string; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 group">
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? 'border-[#F4C430]' : 'border-gray-300 dark:border-[#444]'
          }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-[#F4C430]" />}
      </span>
      <span className={`text-[13px] transition-colors ${selected ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-[#777]'
        }`}>
        {label}
      </span>
    </button>
  )
}

/* ── Section card ── */
function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-[#F4C430]/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

/* ── Divider ── */
function Divider() {
  return <div className="border-t border-gray-50 dark:border-[#252525] my-4" />
}

const ACCENT_COLORS = [
  '#F4C430', '#A855F7', '#3B82F6', '#22C55E', '#EC4899',
]

type ThemeMode = 'dark' | 'light' | 'system'

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [accent, setAccent] = useState(DEFAULT_SETTINGS.accent)
  const [reportStyle, setReportStyle] = useState<'professional' | 'casual'>(DEFAULT_SETTINGS.reportStyle)
  const [outputLength, setOutputLength] = useState<'short' | 'detailed'>(DEFAULT_SETTINGS.outputLength)
  const [language, setLanguage] = useState<'english' | 'indonesia'>(DEFAULT_SETTINGS.language)
  const [notif, setNotif] = useState({ daily: true, weekly: true, product: false })
  const [priv, setPriv] = useState({ saveLogs: true, analytics: false })
  const [loaded, setLoaded] = useState(false)

  // Load persisted settings on mount.
  useEffect(() => {
    repository.getSettings().then((s) => {
      setAccent(s.accent)
      setReportStyle(s.reportStyle)
      setOutputLength(s.outputLength)
      setLanguage(s.language)
      setLoaded(true)
    })
  }, [])

  // Persist whenever an AI/appearance preference changes (after initial load).
  useEffect(() => {
    if (!loaded) return
    const settings: Settings = {
      theme: themeMode,
      accent,
      reportStyle,
      outputLength,
      language,
    }
    repository.saveSettings(settings)
  }, [loaded, themeMode, accent, reportStyle, outputLength, language])

  useEffect(() => {
    setThemeMode(theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const handleThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode)
    if (mode === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (sys !== (theme === 'dark')) toggleTheme()
    } else {
      if (mode !== theme) toggleTheme()
    }
  }

  const toggleNotif = (k: keyof typeof notif) => setNotif(n => ({ ...n, [k]: !n[k] }))
  const togglePriv = (k: keyof typeof priv) => setPriv(p => ({ ...p, [k]: !p[k] }))

  return (
    <AppShell>
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-[13px] text-gray-400 dark:text-[#666] mt-1">
            Manage your preferences and account settings.
          </p>
        </div>

        {/* ── 2-column landscape grid ── */}
        <div className="grid grid-cols-2 gap-4 items-start">

          {/* ── LEFT column ── */}
          <div className="space-y-4">

            {/* Profile */}
            <Card icon={<User size={15} className="text-[#F4C430]" />} title="Profile">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold select-none">
                    M
                  </div>
                  <button className="absolute bottom-0 right-0 w-5 h-5 bg-gray-100 dark:bg-[#2a2a2a] rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
                    <Camera size={9} className="text-gray-500 dark:text-[#aaa]" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900 dark:text-white">Minlabs</p>
                  <p className="text-[13px] text-gray-400 dark:text-[#666]">minlabs@example.com</p>
                  <p className="text-[11px] text-gray-300 dark:text-[#444] mt-0.5">Member since April 27, 2026</p>
                </div>
                <button className="px-4 py-2 rounded-xl border border-gray-200 dark:border-[#333] text-[13px] font-medium text-gray-700 dark:text-[#ccc] hover:border-gray-300 dark:hover:border-[#444] hover:bg-gray-50 dark:hover:bg-white/5 transition-all shrink-0">
                  Edit Profile
                </button>
              </div>
            </Card>

            {/* Appearance */}
            <Card icon={<Palette size={15} className="text-[#F4C430]" />} title="Appearance">
              <div className="space-y-5">
                {/* Theme */}
                <div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-3">Theme</p>
                  <div className="flex gap-2">
                    {(['dark', 'light', 'system'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => handleThemeMode(m)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[13px] font-medium transition-all ${themeMode === m
                          ? 'border-[#F4C430]/40 bg-[#F4C430]/5 text-gray-900 dark:text-white'
                          : 'border-gray-100 dark:border-[#252525] text-gray-500 dark:text-[#666] hover:border-gray-200 dark:hover:border-[#333]'
                          }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${themeMode === m ? 'border-[#F4C430]' : 'border-gray-300 dark:border-[#444]'
                          }`}>
                          {themeMode === m && <span className="w-1.5 h-1.5 rounded-full bg-[#F4C430]" />}
                        </span>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Accent color */}
                <div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-3">Accent Color</p>
                  <div className="flex items-center gap-2.5">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setAccent(c)}
                        style={{ background: c }}
                        className={`w-9 h-9 rounded-full transition-transform hover:scale-110 ${accent === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1a1a1a]' : ''
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Preferences */}
            <Card icon={<Globe size={15} className="text-[#F4C430]" />} title="AI Preferences">
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-3">Report Style</p>
                  <div className="space-y-2.5">
                    <Radio selected={reportStyle === 'professional'} label="Professional" onChange={() => setReportStyle('professional')} />
                    <Radio selected={reportStyle === 'casual'} label="Casual" onChange={() => setReportStyle('casual')} />
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-3">Output Length</p>
                  <div className="space-y-2.5">
                    <Radio selected={outputLength === 'short'} label="Short" onChange={() => setOutputLength('short')} />
                    <Radio selected={outputLength === 'detailed'} label="Detailed" onChange={() => setOutputLength('detailed')} />
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-400 dark:text-[#555] mb-3">Language</p>
                  <div className="space-y-2.5">
                    <Radio selected={language === 'english'} label="English" onChange={() => setLanguage('english')} />
                    <Radio selected={language === 'indonesia'} label="Indonesia" onChange={() => setLanguage('indonesia')} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-[#252525]">
                <Sparkles size={11} className="text-gray-300 dark:text-[#444] shrink-0" />
                <p className="text-[11px] text-gray-400 dark:text-[#555]">
                  These preferences will be applied to your AI generated reports.
                </p>
              </div>
            </Card>

          </div>{/* end LEFT */}

          {/* ── RIGHT column ── */}
          <div className="space-y-4">

            {/* Notifications */}
            <Card icon={<Bell size={15} className="text-[#F4C430]" />} title="Notifications">
              <div className="space-y-4">
                {[
                  { k: 'daily' as const, Icon: CalendarDays, title: 'Daily reminder', desc: 'Remind me to log my work every day' },
                  { k: 'weekly' as const, Icon: Mail, title: 'Weekly summary', desc: 'Receive weekly summary of my work logs' },
                  { k: 'product' as const, Icon: Megaphone, title: 'Product updates', desc: 'Get notified about new features and updates' },
                ].map(({ k, Icon, title, desc }) => (
                  <div key={k} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-gray-400 dark:text-[#666]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white">{title}</p>
                        <p className="text-[11px] text-gray-400 dark:text-[#555]">{desc}</p>
                      </div>
                    </div>
                    <Toggle on={notif[k]} onChange={() => toggleNotif(k)} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy & Data */}
            <Card icon={<Shield size={15} className="text-[#F4C430]" />} title="Privacy & Data">
              <div className="space-y-4">
                {[
                  { k: 'saveLogs' as const, Icon: Database, title: 'Save logs history', desc: 'Store my logs and reports in the cloud' },
                  { k: 'analytics' as const, Icon: BarChart2, title: 'Allow analytics', optional: true, desc: 'Help us improve Logify AI by sharing anonymous usage data' },
                ].map(({ k, Icon, title, desc, optional }) => (
                  <div key={k} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-[#252525] flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-gray-400 dark:text-[#666]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white">
                          {title}
                          {optional && <span className="text-[11px] text-gray-400 dark:text-[#555] font-normal ml-1">(optional)</span>}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-[#555]">{desc}</p>
                      </div>
                    </div>
                    <Toggle on={priv[k]} onChange={() => togglePriv(k)} />
                  </div>
                ))}
              </div>
              <Divider />
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 text-[13px] font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors shrink-0">
                  Delete all data
                </button>
                <p className="text-[11px] text-gray-400 dark:text-[#555] leading-relaxed">
                  This will permanently delete all your data and cannot be undone.
                </p>
              </div>
            </Card>

            {/* Plan */}
            <Card icon={<Crown size={15} className="text-[#F4C430]" />} title="Plan">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-[11px] text-gray-400 dark:text-[#555] mb-1">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">Free</p>
                  <p className="text-[12px] text-gray-400 dark:text-[#555] mt-0.5">Basic features with daily limits</p>
                </div>
                <div className="text-right shrink-0">
                  <button className="flex items-center gap-2 bg-[#F4C430] hover:bg-[#e0b420] text-black text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors mb-2">
                    <Crown size={13} />
                    Upgrade to Pro
                  </button>
                  <p className="text-[11px] text-gray-400 dark:text-[#555] max-w-[200px] leading-relaxed">
                    Unlock unlimited logs, advanced insights, export, and more.
                  </p>
                </div>
              </div>
            </Card>

            {/* Account */}
            <Card icon={<User size={15} className="text-[#F4C430]" />} title="Account">
              <button className="w-full flex items-center justify-between py-1 group">
                <span className="text-[13px] font-semibold text-red-500 group-hover:text-red-600 transition-colors">
                  Logout
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400 dark:text-[#555]">Sign out from your account</span>
                  <ChevronRight size={14} className="text-gray-300 dark:text-[#444] group-hover:text-gray-500 dark:group-hover:text-[#666] transition-colors" />
                </div>
              </button>
            </Card>

          </div>{/* end RIGHT */}

        </div>
      </main>
    </AppShell>
  )
}
