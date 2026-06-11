import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { GeneratedReport } from '@/types'

const PROMPT = `Convert the following daily work notes into a structured professional report.

Return a JSON object with exactly these keys:
{
  "summary": "2-3 sentence overview",
  "accomplishments": ["item1", "item2", ...],
  "challenges": ["item1", ...],
  "nextSteps": ["item1", ...]
}

Keep each list to 2-4 bullet points. Be concise and professional. Return ONLY the JSON object, no markdown.`

export async function POST(req: NextRequest) {
  const { input, tags } = await req.json()

  if (!input?.trim()) {
    return NextResponse.json({ error: 'No input provided' }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY

  // Demo mode when no API key
  if (!apiKey) {
    const demo: GeneratedReport = {
      summary: `Productive work session covering: ${input.slice(0, 80)}${input.length > 80 ? '...' : ''}. Work was well-structured and aligned with team goals.`,
      accomplishments: [
        'Completed assigned tasks efficiently',
        'Collaborated with team members effectively',
        tags.length > 0 ? `Focused on ${tags.join(', ')} activities` : 'Maintained high quality output',
      ],
      challenges: [
        'Time management across multiple priorities',
        'Coordinating dependencies with other teams',
      ],
      nextSteps: [
        'Follow up on pending items from today',
        'Review progress in tomorrow\'s standup',
        'Document outcomes for team visibility',
      ],
    }
    await new Promise(r => setTimeout(r, 1200))
    return NextResponse.json(demo)
  }

  try {
    const client = new OpenAI({ apiKey })
    const tagNote = tags.length > 0 ? `\n\nWork categories: ${tags.join(', ')}` : ''

    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: `${input}${tagNote}` },
      ],
      temperature: 0.4,
      max_tokens: 600,
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const report: GeneratedReport = JSON.parse(raw)
    return NextResponse.json(report)
  } catch (err) {
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
