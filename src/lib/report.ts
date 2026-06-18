import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import type { GeneratedReport } from '@/types'

// ── Validation schema ──
// The shape the UI relies on. We validate every report (AI or demo) against
// this before returning, so a malformed model response can never reach the
// client as a half-broken object.
export const reportSchema = z.object({
  summary: z.string().min(1),
  accomplishments: z.array(z.string().min(1)).min(1).max(6),
  challenges: z.array(z.string().min(1)).max(6),
  nextSteps: z.array(z.string().min(1)).max(6),
})

export interface ReportOptions {
  reportStyle?: 'professional' | 'casual'
  outputLength?: 'short' | 'detailed'
  language?: 'english' | 'indonesia'
}

const MODEL = 'claude-haiku-4-5'

function buildSystemPrompt(opts: ReportOptions): string {
  const tone =
    opts.reportStyle === 'casual'
      ? 'a friendly, casual tone'
      : 'a clear, professional tone suitable for reporting to a manager'
  const length =
    opts.outputLength === 'detailed'
      ? '3-5 bullet points per list, each one a full sentence'
      : '2-4 concise bullet points per list'
  const language =
    opts.language === 'indonesia'
      ? 'Write the entire report in Bahasa Indonesia.'
      : 'Write the entire report in English.'

  return [
    'You convert raw daily work notes into a structured professional report.',
    `Use ${tone}. Keep each list to ${length}.`,
    language,
    'Base the report strictly on the notes provided. Do not invent work that was not mentioned — if a section has nothing to report, return an empty array for it.',
  ].join(' ')
}

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    accomplishments: { type: 'array', items: { type: 'string' } },
    challenges: { type: 'array', items: { type: 'string' } },
    nextSteps: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'accomplishments', 'challenges', 'nextSteps'],
  additionalProperties: false,
} as const

/** Deterministic demo report — used when no API key is configured. */
export function demoReport(input: string, tags: string[]): GeneratedReport {
  return {
    summary: `Productive work session covering: ${input.slice(0, 80)}${
      input.length > 80 ? '...' : ''
    }. Work was well-structured and aligned with team goals.`,
    accomplishments: [
      'Completed assigned tasks efficiently',
      'Collaborated with team members effectively',
      tags.length > 0
        ? `Focused on ${tags.join(', ')} activities`
        : 'Maintained high quality output',
    ],
    challenges: [
      'Time management across multiple priorities',
      'Coordinating dependencies with other teams',
    ],
    nextSteps: [
      'Follow up on pending items from today',
      "Review progress in tomorrow's standup",
      'Document outcomes for team visibility',
    ],
  }
}

/**
 * Generate a report via Claude. Throws on API failure; the caller decides how
 * to surface that. Output is validated against `reportSchema` before return.
 */
export async function generateReport(
  apiKey: string,
  input: string,
  tags: string[],
  opts: ReportOptions = {},
): Promise<GeneratedReport> {
  const client = new Anthropic({ apiKey })
  const tagNote = tags.length > 0 ? `\n\nWork categories: ${tags.join(', ')}` : ''

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(opts),
    output_config: { format: { type: 'json_schema', schema: JSON_SCHEMA } },
    messages: [{ role: 'user', content: `${input}${tagNote}` }],
  })

  // Structured output guarantees valid JSON, but we still parse + validate
  // defensively so a schema/SDK change can't silently corrupt the response.
  const text = message.content.find((b) => b.type === 'text')
  if (!text || text.type !== 'text') {
    throw new Error('No text block in model response')
  }
  return reportSchema.parse(JSON.parse(text.text))
}
