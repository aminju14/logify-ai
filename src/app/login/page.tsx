'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/lib/auth'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, enabled } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // In localStorage mode there are no accounts — there's nothing to log into.
  // Already-signed-in users get redirected home.
  useEffect(() => {
    if (!enabled) router.replace('/')
    else if (!authLoading && user) router.replace('/')
  }, [enabled, authLoading, user, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setNotice(null)
    setSubmitting(true)
    const fn = mode === 'signin' ? signIn : signUp
    const { error } = await fn(email.trim(), password)
    setSubmitting(false)
    if (error) {
      setError(error)
    } else if (mode === 'signup') {
      setNotice('Check your email to confirm your account, then sign in.')
      setMode('signin')
    } else {
      router.replace('/')
    }
  }

  if (!enabled || (authLoading || user)) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0d0d0d]">
        <Loader2 className="animate-spin text-[#F4C430]" size={24} />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0d0d0d] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#F4C430] flex items-center justify-center">
            <Sparkles size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Logify AI</span>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-[#252525] p-6 shadow-sm dark:shadow-none">
          <h1 className="text-[17px] font-bold text-gray-900 dark:text-white mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-[13px] text-gray-400 dark:text-[#666] mb-5">
            {mode === 'signin' ? 'Sign in to continue to your dashboard.' : 'Start logging your work with AI.'}
          </p>

          <form onSubmit={submit} className="space-y-3">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2.5">
              <Mail size={15} className="text-gray-300 dark:text-[#555] shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-[13px] text-gray-800 dark:text-[#ccc] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#141414] border border-gray-100 dark:border-[#252525] rounded-xl px-3 py-2.5">
              <Lock size={15} className="text-gray-300 dark:text-[#555] shrink-0" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="flex-1 bg-transparent text-[13px] text-gray-800 dark:text-[#ccc] placeholder-gray-300 dark:placeholder-[#444] focus:outline-none"
              />
            </div>

            {error && <p className="text-[12px] text-red-500">{error}</p>}
            {notice && <p className="text-[12px] text-emerald-500">{notice}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#F4C430] hover:bg-[#e0b420] disabled:opacity-60 text-black font-semibold text-[13px] py-2.5 rounded-xl transition-all"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-[12px] text-gray-400 dark:text-[#666] text-center mt-4">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin')
                setError(null)
                setNotice(null)
              }}
              className="text-[#F4C430] font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
