import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  demoReport,
  generateReport,
  type ReportOptions,
} from '@/lib/report'
import { rateLimit, pruneRateLimits } from '@/lib/rate-limit'

const requestSchema = z.object({
  input: z.string().trim().min(1, 'No input provided').max(5000),
  tags: z.array(z.string()).max(10).default([]),
  options: z
    .object({
      reportStyle: z.enum(['professional', 'casual']).optional(),
      outputLength: z.enum(['short', 'detailed']).optional(),
      language: z.enum(['english', 'indonesia']).optional(),
    })
    .optional(),
})

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: NextRequest) {
  // ── Rate limit ──
  pruneRateLimits()
  const { allowed, resetAt } = rateLimit(clientIp(req))
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  // ── Validate input ──
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }
  const { input, tags, options } = parsed.data

  // ── Demo mode when no API key ──
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1200))
    return NextResponse.json(demoReport(input, tags))
  }

  // ── Generate via Claude ──
  try {
    const report = await generateReport(
      apiKey,
      input,
      tags,
      (options ?? {}) as ReportOptions,
    )
    return NextResponse.json(report)
  } catch (err) {
    console.error('Report generation failed:', err)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 },
    )
  }
}
